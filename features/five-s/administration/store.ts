"use client";
import { useSyncExternalStore } from "react";
import { safeSetStorage } from "@/lib/browser-storage";
import { FIVE_S_ZONE_CONFIGURATION } from "@/lib/five-s/configuration";
import { DEMO_USERS } from "@/lib/current-user";
import { hasPermission, permissionsForRoles } from "./permissions";
import type { AdminRole, AdminUser, AdminUserInput } from "./types";

const KEY="five-s-administration-users-v1",STAMP="2026-09-02T00:00:00.000Z";
function email(name:string){return `${name.toLowerCase().replace(/[^a-z0-9]+/g,".").replace(/^\.|\.$/g,"")}@egmore.example`}
function seeds():AdminUser[]{const map=new Map<string,AdminUser>();const add=(id:string,name:string,roles:AdminRole[],zone:string,responsibility:"Leader"|"Member")=>map.set(id,{id,employeeId:id.replace("USR-","EMP-"),name,email:email(name),plant:"Egmore Plant",status:"Active",roles,zoneMemberships:[{zone,responsibility}],permissions:permissionsForRoles(roles),updatedAt:STAMP});for(const zone of FIVE_S_ZONE_CONFIGURATION){add(zone.leaderId,zone.leader,zone.leaderId===DEMO_USERS.auditor.id?["Admin","Auditor","Zone Leader"]:["Zone Leader"],zone.name,"Leader");for(const member of zone.members)add(member.id,member.name,["Zone Member"],zone.name,"Member")}return [...map.values()]}
export const ADMIN_USER_SEEDS=seeds(); let users=ADMIN_USER_SEEDS,loaded=false;const listeners=new Set<()=>void>();
function load(){if(loaded||typeof window==="undefined")return;loaded=true;try{const saved=window.localStorage.getItem(KEY);if(saved){const parsed=JSON.parse(saved);if(Array.isArray(parsed))users=parsed}}catch{}}
function emit(){if(typeof window==="undefined")return false;const result=safeSetStorage(KEY,users);if(!result.success)return false;listeners.forEach(listener=>listener());return true}
function subscribe(listener:()=>void){load();listeners.add(listener);return()=>listeners.delete(listener)}function snapshot(){load();return users}
export function useAdminUsers(){return useSyncExternalStore(subscribe,snapshot,()=>ADMIN_USER_SEEDS)}
export function getAdminUser(userId:string){load();return users.find(user=>user.id===userId)}
function requireManager(actorId:string){const actor=getAdminUser(actorId);if(!hasPermission(actor,"administration.manage_users"))throw new Error("Administration access is required.");return actor!}
export function createAdminUser(input:AdminUserInput,actorId:string){requireManager(actorId);load();if(users.some(user=>user.employeeId.toLowerCase()===input.employeeId.trim().toLowerCase()))throw new Error("Employee ID already exists.");const item:AdminUser={...input,id:`USR-${crypto.randomUUID()}`,employeeId:input.employeeId.trim(),name:input.name.trim(),email:input.email.trim(),updatedAt:new Date().toISOString()};const previous=users;users=[item,...users];if(!emit()){users=previous;return null}return item}
export function updateAdminUser(id:string,input:AdminUserInput,actorId:string){const actor=requireManager(actorId);load();const current=users.find(user=>user.id===id);if(!current)throw new Error("User not found.");if(id===actor.id&&(!input.roles.includes("Admin")||!input.permissions.includes("administration.manage_users")||input.status!=="Active"))throw new Error("You cannot remove your own Administration access or deactivate your account.");if(users.some(user=>user.id!==id&&user.employeeId.toLowerCase()===input.employeeId.trim().toLowerCase()))throw new Error("Employee ID already exists.");const previous=users;users=users.map(user=>user.id===id?{...user,...input,employeeId:input.employeeId.trim(),name:input.name.trim(),email:input.email.trim(),updatedAt:new Date().toISOString()}:user);if(!emit()){users=previous;return null}return users.find(user=>user.id===id)}
export function setAdminUserActive(id:string,active:boolean,actorId:string){const actor=requireManager(actorId);if(id===actor.id&&!active)throw new Error("You cannot deactivate your own Admin account.");load();const previous=users;users=users.map(user=>user.id===id?{...user,status:active?"Active":"Inactive",updatedAt:new Date().toISOString()}:user);if(!emit()){users=previous;return false}return true}
