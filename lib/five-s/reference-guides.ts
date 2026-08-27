import type { AppLanguage } from "@/lib/ui-preferences";
import type { FiveSCategory, FiveSQuestion } from "@/features/five-s/types/five-s";

type ReferenceFields = Pick<FiveSQuestion, "referenceImage" | "referenceTitleKey" | "referenceGuidanceKey" | "referenceAltKey">;

const slugs: Record<FiveSCategory, string> = {
  Sort: "sort",
  "Set in Order": "set-in-order",
  Shine: "shine",
  Standardize: "standardize",
  Sustain: "sustain",
};

const en: Record<FiveSCategory, Array<[string, string]>> = {
  Sort: [
    ["Necessary items only", "Only items required for current work should remain. Remove unnecessary materials, cartons, tools, and obsolete items."],
    ["Obsolete item control", "Identify obsolete, broken, and unused tools and move them to a clearly controlled red-tag or disposal area."],
    ["Controlled material quantity", "Keep raw materials within defined minimum and maximum quantities in clearly identified storage locations."],
    ["Scrap segregation", "Separate rejected and scrap material from usable stock in clearly labelled, contained areas."],
    ["Red-tag identification", "Red-tagged items should show their status clearly and remain in a designated review area until disposition."],
    ["Current documents only", "Keep only current, controlled work instructions and forms at the production document station."],
    ["Designated personal storage", "Personal belongings should be kept in assigned lockers or storage away from production work areas."],
  ],
  "Set in Order": [
    ["A place for every item", "Frequently used tools and materials should have a clearly defined location close to the point of use."],
    ["Clearly identified locations", "Use readable labels on shelves, racks, and bins so each storage location is immediately understood."],
    ["Easy tool retrieval", "Arrange tools on an outlined shadow board so missing tools are visible and each tool is easy to retrieve."],
    ["Visual storage markings", "Use floor, shelf, or bin markings to show exactly where stored items belong."],
    ["Visible quantity limits", "Display minimum and maximum levels or kanban limits so excess and shortage are immediately visible."],
    ["Marked walkways", "Keep pedestrian routes clearly painted, continuous, and free from stored materials or equipment."],
    ["Visible emergency equipment", "Emergency equipment should be unobstructed and identified with high-visibility floor and wall markings."],
    ["Defined WIP zones", "Keep work-in-progress inside labelled staging lanes or boxes with clear boundaries."],
    ["Systematic jig storage", "Store fixtures and jigs in labelled rack positions that protect them and make retrieval easy."],
  ],
  Shine: [
    ["Clean workplace", "Floors, benches, and surrounding production areas should be clean and free from waste and visible dirt."],
    ["Clean equipment", "Machine surfaces should be clean, with no accumulated oil, swarf, dust, or residue."],
    ["Defined cleaning ownership", "A visible responsibility board should identify who cleans each area and what they must check."],
    ["Available cleaning schedule", "Display a current cleaning schedule showing tasks, frequency, owner, and completion status."],
    ["Immediate spill response", "Contain and clean leaks or spills promptly, then identify and correct their source."],
    ["Organized cleaning tools", "Store brooms, mops, and cleaning supplies at a dedicated, outlined cleaning station."],
    ["Clean and inspect", "Use cleaning as an inspection opportunity to find leaks, looseness, wear, damage, and other abnormalities."],
    ["Maintained waste bins", "Use clean, labelled, correctly segregated bins that are not overflowing and have clear access."],
  ],
  Standardize: [
    ["Displayed 5S standards", "Post clear 5S standards at the workplace so the expected condition can be checked at a glance."],
    ["Defined cleaning standard", "Use a visual instruction that shows the cleaning method, tools, frequency, and expected result."],
    ["Clear responsibility assignment", "Display area ownership and responsibilities so every task has a named accountable person."],
    ["Standard condition photographs", "Show an approved photograph of the correct workstation condition for quick comparison."],
    ["Consistent visual management", "Maintain consistent labels, floor markings, status boards, and defined storage locations."],
    ["Visible abnormalities", "Use tags, status signals, or defect markers so abnormal conditions are immediately recognizable."],
    ["Periodic standards review", "Review workplace standards with the team and record updates, findings, and agreed actions."],
  ],
  Sustain: [
    ["Standards followed daily", "Employees should consistently work within the defined locations, controls, and workstation standards."],
    ["Audit actions closed", "Track every audit finding to a verified corrective-action closure with owner and completion date."],
    ["Repeat findings controlled", "Use visible corrective-action tracking to identify recurrence and confirm lasting countermeasures."],
    ["Periodic audits performed", "Conduct scheduled workplace audits using the approved checklist and record findings at the point of inspection."],
    ["Employees trained", "Provide practical 5S training that uses workplace examples and confirms employee understanding."],
    ["Improvement ideas encouraged", "Make employee kaizen ideas visible, assign owners, and show their review and implementation status."],
    ["Performance communicated", "Display current 5S scores, trends, priorities, and actions where production employees can see them."],
    ["Ownership actively maintained", "Update the daily 5S ownership board and confirm assigned checks are completed consistently."],
  ],
};

const languageLead: Record<Exclude<AppLanguage, "en">, string> = {
  hi: "अच्छी स्थिति: ",
  ta: "நல்ல நிலை: ",
  bn: "ভালো অবস্থা: ",
  ja: "良い状態：",
};

const translatedGuidance: Record<Exclude<AppLanguage, "en">, Record<FiveSCategory, string[]>> = {
  hi: {
    Sort: ["केवल वर्तमान काम के लिए आवश्यक वस्तुएँ रखें; अनावश्यक सामग्री, डिब्बे, औजार और पुरानी वस्तुएँ हटाएँ।","पुराने, टूटे और अनुपयोगी औजार पहचानकर नियंत्रित रेड-टैग या निपटान क्षेत्र में रखें।","कच्चे माल को स्पष्ट स्थानों पर निर्धारित न्यूनतम और अधिकतम मात्रा में रखें।","अस्वीकृत और स्क्रैप सामग्री को उपयोगी स्टॉक से अलग, स्पष्ट लेबल वाले क्षेत्र में रखें।","रेड-टैग वस्तु की स्थिति स्पष्ट हो और निर्णय तक वह निर्धारित समीक्षा क्षेत्र में रहे।","उत्पादन दस्तावेज़ केंद्र पर केवल वर्तमान नियंत्रित निर्देश और फॉर्म रखें।","निजी सामान उत्पादन क्षेत्र से दूर निर्धारित लॉकर या स्थान में रखें।"],
    "Set in Order": ["अधिक उपयोग वाले औजार और सामग्री का उपयोग-बिंदु के पास स्पष्ट निर्धारित स्थान हो।","शेल्फ, रैक और बिन पर पढ़ने योग्य लेबल लगाएँ।","औजारों को आउटलाइन वाले शैडो बोर्ड पर रखें ताकि कमी तुरंत दिखे।","फर्श, शेल्फ या बिन मार्किंग से वस्तु का सही स्थान दिखाएँ।","न्यूनतम-अधिकतम या कानबान सीमा दिखाएँ ताकि अधिकता और कमी तुरंत दिखे।","पैदल मार्ग स्पष्ट, लगातार चिह्नित और बाधा-मुक्त रखें।","आपात उपकरण बाधा-मुक्त और उच्च-दृश्यता चिह्नों से पहचाने जाएँ।","WIP को स्पष्ट सीमा वाले लेबलयुक्त स्टेजिंग लेन या बॉक्स में रखें।","जिग और फिक्स्चर सुरक्षित, लेबलयुक्त रैक स्थानों में रखें।"],
    Shine: ["फर्श, बेंच और उत्पादन क्षेत्र साफ तथा कचरे और दिखाई देने वाली गंदगी से मुक्त हों।","मशीन पर जमा तेल, बुरादा, धूल या अवशेष न हों।","दृश्य बोर्ड बताए कि कौन किस क्षेत्र को साफ और जाँचता है।","कार्य, आवृत्ति, जिम्मेदार और पूर्णता वाला वर्तमान सफाई कार्यक्रम प्रदर्शित करें।","रिसाव तुरंत रोककर साफ करें और उसके स्रोत को ठीक करें।","सफाई औजार निर्धारित आउटलाइन वाले स्टेशन पर रखें।","सफाई के दौरान रिसाव, ढीलापन, घिसाव और क्षति भी जाँचें।","साफ, लेबलयुक्त, अलग-अलग कचरा बिन रखें; वे भरे हुए न हों।"],
    Standardize: ["कार्यस्थल पर स्पष्ट 5S मानक लगाएँ ताकि अपेक्षित स्थिति तुरंत जाँची जा सके।","चित्र सहित निर्देश में विधि, औजार, आवृत्ति और अपेक्षित परिणाम दिखाएँ।","क्षेत्र स्वामित्व और कार्यों के लिए नामित जिम्मेदार व्यक्ति दिखाएँ।","तुलना के लिए सही कार्यस्थल स्थिति का स्वीकृत फोटो प्रदर्शित करें।","लेबल, फर्श चिह्न, स्थिति बोर्ड और निर्धारित स्थान समान रूप से बनाए रखें।","टैग, संकेत या दोष चिह्न से असामान्य स्थिति तुरंत दिखाएँ।","टीम के साथ मानक की समीक्षा कर बदलाव, निष्कर्ष और कार्रवाई दर्ज करें।"],
    Sustain: ["कर्मचारी प्रतिदिन निर्धारित स्थानों, नियंत्रणों और कार्यस्थल मानकों का पालन करें।","हर ऑडिट निष्कर्ष को जिम्मेदार और तारीख सहित सत्यापित समापन तक ट्रैक करें।","दोहराव पहचानने और स्थायी सुधार जाँचने के लिए दृश्य ट्रैकिंग रखें।","स्वीकृत चेकलिस्ट से निर्धारित ऑडिट करें और निरीक्षण स्थल पर निष्कर्ष दर्ज करें।","व्यावहारिक कार्यस्थल उदाहरणों से 5S प्रशिक्षण दें और समझ की पुष्टि करें।","काइज़ेन सुझाव दिखाएँ, जिम्मेदार तय करें और समीक्षा व क्रियान्वयन स्थिति बताएँ।","वर्तमान 5S स्कोर, रुझान, प्राथमिकताएँ और कार्रवाई उत्पादन क्षेत्र में दिखाएँ।","दैनिक स्वामित्व बोर्ड अपडेट कर निर्धारित जाँचों की नियमित पूर्णता सुनिश्चित करें।"],
  },
  ta: {
    Sort: ["தற்போதைய பணிக்குத் தேவையான பொருட்களை மட்டும் வைத்து, தேவையற்ற பொருட்கள் மற்றும் கருவிகளை அகற்றவும்.","பழைய, உடைந்த, பயன்படுத்தாத கருவிகளை அடையாளம் கண்டு ரெட்-டேக் பகுதிக்கு மாற்றவும்.","மூலப்பொருட்களை குறைந்தபட்ச–அதிகபட்ச வரம்புக்குள் குறிக்கப்பட்ட இடத்தில் வைக்கவும்.","நிராகரிக்கப்பட்ட மற்றும் கழிவுப் பொருட்களை பயன்படும் இருப்பிலிருந்து பெயரிடப்பட்ட பகுதிகளில் பிரிக்கவும்.","ரெட்-டேக் பொருளின் நிலை தெளிவாக இருந்து, முடிவு வரை குறிப்பிட்ட பகுதியில் இருக்க வேண்டும்.","தற்போதைய கட்டுப்படுத்தப்பட்ட பணி அறிவுறுத்தல்கள் மற்றும் படிவங்களை மட்டும் வைக்கவும்.","தனிப்பட்ட பொருட்களை உற்பத்திப் பகுதியிலிருந்து விலகிய ஒதுக்கப்பட்ட லாக்கரில் வைக்கவும்."],
    "Set in Order": ["அடிக்கடி பயன்படும் கருவிகளுக்கு பயன்பாட்டு இடத்தருகே தெளிவான நிரந்தர இடம் இருக்க வேண்டும்.","அலமாரி, ரேக் மற்றும் பெட்டிகளில் தெளிவாகப் படிக்கக்கூடிய அடையாளங்களைப் பயன்படுத்தவும்.","ஒவ்வொரு கருவியின் இடமும் தெரியும் ஷேடோ போர்டில் கருவிகளை ஒழுங்குபடுத்தவும்.","தரை, அலமாரி அல்லது பெட்டி குறியீடுகள் பொருளின் சரியான இடத்தைக் காட்ட வேண்டும்.","குறைந்தபட்ச–அதிகபட்ச அல்லது கான்பான் அளவு வரம்புகளை தெளிவாகக் காட்டவும்.","நடைபாதைகளை தொடர்ச்சியாகக் குறியிட்டு தடையின்றி வைத்திருக்கவும்.","அவசர உபகரணங்களை மறைப்பின்றி, தெளிவான சுவர் மற்றும் தரைக் குறியீடுகளுடன் வைக்கவும்.","WIP பொருட்களை எல்லை குறிக்கப்பட்ட, பெயரிடப்பட்ட பகுதிகளுக்குள் வைக்கவும்.","ஜிக் மற்றும் ஃபிக்சர்களை பாதுகாப்பான பெயரிடப்பட்ட ரேக் இடங்களில் வைக்கவும்."],
    Shine: ["தரை, மேசை மற்றும் உற்பத்திப் பகுதி அழுக்கு மற்றும் கழிவின்றி சுத்தமாக இருக்க வேண்டும்.","இயந்திரத்தில் எண்ணெய், தூசி, சில்லுகள் அல்லது எச்சம் சேராமல் வைத்திருக்கவும்.","ஒவ்வொரு பகுதியையும் யார் சுத்தம் செய்து சோதிக்கிறார் என்பதை பொறுப்புப் பலகை காட்ட வேண்டும்.","பணி, அடிக்கடி செய்யும் காலம், பொறுப்பாளர் மற்றும் நிறைவு நிலையுடன் அட்டவணையை காட்டவும்.","கசிவு அல்லது சிந்தலை உடனே கட்டுப்படுத்தி சுத்தம் செய்து மூல காரணத்தைச் சரிசெய்யவும்.","சுத்தம் செய்யும் கருவிகளை ஒதுக்கப்பட்ட குறியிடப்பட்ட நிலையத்தில் வைக்கவும்.","சுத்தம் செய்யும்போது கசிவு, தளர்வு, தேய்வு மற்றும் சேதத்தைச் சோதிக்கவும்.","சுத்தமான, பெயரிடப்பட்ட, சரியாகப் பிரிக்கப்பட்ட நிரம்பாத கழிவுத் தொட்டிகளைப் பயன்படுத்தவும்."],
    Standardize: ["எதிர்பார்க்கப்படும் நிலையை உடனே சரிபார்க்க 5S தரநிலைகளை பணியிடத்தில் காட்டவும்.","முறை, கருவி, கால அளவு மற்றும் எதிர்பார்க்கும் முடிவை பட வழிமுறையில் காட்டவும்.","ஒவ்வொரு பணிக்கும் பெயரிடப்பட்ட பொறுப்பாளருடன் பகுதி உரிமையை காட்டவும்.","ஒப்பிடுவதற்கு அங்கீகரிக்கப்பட்ட சரியான பணியிடப் புகைப்படத்தை காட்டவும்.","லேபிள், தரைக் குறியீடு, நிலைப் பலகை மற்றும் நிரந்தர இடங்களை ஒரே முறையில் பராமரிக்கவும்.","டேக், சிக்னல் அல்லது குறை குறியீட்டால் அசாதாரண நிலையை உடனே தெரியச் செய்யவும்.","குழுவுடன் தரநிலைகளை மதிப்பாய்வு செய்து மாற்றங்களையும் நடவடிக்கைகளையும் பதிவு செய்யவும்."],
    Sustain: ["ஊழியர்கள் வரையறுக்கப்பட்ட இடங்கள், கட்டுப்பாடுகள் மற்றும் பணியிடத் தரங்களை தினமும் பின்பற்ற வேண்டும்.","ஒவ்வொரு தணிக்கை கண்டுபிடிப்பையும் பொறுப்பாளர் மற்றும் தேதியுடன் சரிபார்க்கப்பட்ட முடிவு வரை கண்காணிக்கவும்.","மீண்டும் நிகழ்வதை கண்டறிந்து நிலையான எதிர்நடவடிக்கையை உறுதிப்படுத்த காட்சி கண்காணிப்பைப் பயன்படுத்தவும்.","அங்கீகரிக்கப்பட்ட பட்டியலால் திட்டமிட்ட தணிக்கையை செய்து இடத்திலேயே கண்டுபிடிப்புகளைப் பதிவு செய்யவும்.","பணியிட உதாரணங்களுடன் நடைமுறை 5S பயிற்சி அளித்து புரிதலை உறுதிப்படுத்தவும்.","கைசன் யோசனைகள், பொறுப்பாளர், மதிப்பாய்வு மற்றும் செயல்படுத்தல் நிலையை காட்டவும்.","தற்போதைய 5S மதிப்பெண், போக்கு, முன்னுரிமை மற்றும் நடவடிக்கைகளை உற்பத்திப் பகுதியில் காட்டவும்.","தினசரி உரிமைப் பலகையைப் புதுப்பித்து ஒதுக்கப்பட்ட சோதனைகள் முடிவதை உறுதிசெய்யவும்."],
  },
  bn: {
    Sort: ["বর্তমান কাজের জন্য প্রয়োজনীয় বস্তুগুলোই রাখুন; অপ্রয়োজনীয় উপকরণ ও সরঞ্জাম সরান।","পুরোনো, ভাঙা ও অব্যবহৃত সরঞ্জাম চিহ্নিত করে নিয়ন্ত্রিত রেড-ট্যাগ এলাকায় রাখুন।","কাঁচামাল নির্ধারিত ন্যূনতম ও সর্বোচ্চ পরিমাণের মধ্যে চিহ্নিত স্থানে রাখুন।","বাতিল ও স্ক্র্যাপ উপকরণ ব্যবহারযোগ্য মজুত থেকে আলাদা, লেবেলযুক্ত এলাকায় রাখুন।","রেড-ট্যাগ বস্তুটির অবস্থা স্পষ্ট রাখুন এবং সিদ্ধান্ত না হওয়া পর্যন্ত নির্ধারিত এলাকায় রাখুন।","উৎপাদন নথি কেন্দ্রে শুধু বর্তমান নিয়ন্ত্রিত নির্দেশনা ও ফর্ম রাখুন।","ব্যক্তিগত জিনিস উৎপাদন এলাকা থেকে দূরে নির্ধারিত লকারে রাখুন।"],
    "Set in Order": ["ঘন ঘন ব্যবহৃত সরঞ্জাম ও উপকরণের ব্যবহারস্থলের কাছে নির্দিষ্ট স্থান রাখুন।","শেলফ, র‍্যাক ও বিনে সহজে পড়া যায় এমন লেবেল ব্যবহার করুন।","শেডো বোর্ডে প্রতিটি সরঞ্জামের নির্দিষ্ট রেখাচিত্রিত স্থান রাখুন।","মেঝে, শেলফ বা বিনের চিহ্নে প্রতিটি বস্তুর সঠিক স্থান দেখান।","ন্যূনতম–সর্বোচ্চ বা কানবান সীমা দেখান যাতে ঘাটতি ও অতিরিক্ত মজুত বোঝা যায়।","পথচারী চলাচলের পথ স্পষ্ট, ধারাবাহিক এবং বাধামুক্ত রাখুন।","জরুরি সরঞ্জাম বাধামুক্ত ও স্পষ্ট দেয়াল-মেঝে চিহ্নে শনাক্ত রাখুন।","WIP লেবেলযুক্ত ও সীমানা-চিহ্নিত স্টেজিং এলাকার মধ্যে রাখুন।","জিগ ও ফিক্সচার সুরক্ষিত, লেবেলযুক্ত র‍্যাক অবস্থানে রাখুন।"],
    Shine: ["মেঝে, বেঞ্চ ও উৎপাদন এলাকা দৃশ্যমান ময়লা ও বর্জ্য থেকে পরিষ্কার রাখুন।","মেশিনে জমা তেল, ধুলো, চিপস বা অবশিষ্টাংশ রাখবেন না।","কে কোন এলাকা পরিষ্কার ও পরীক্ষা করে তা দায়িত্ব বোর্ডে দেখান।","কাজ, সময়কাল, দায়িত্বশীল ব্যক্তি ও সম্পন্ন অবস্থা সহ বর্তমান সময়সূচি দেখান।","লিক বা ছড়িয়ে পড়া পদার্থ দ্রুত নিয়ন্ত্রণ ও পরিষ্কার করে উৎস সংশোধন করুন।","পরিষ্কারের সরঞ্জাম নির্ধারিত রেখাচিত্রিত স্টেশনে রাখুন।","পরিষ্কারের সময় লিক, ঢিলা অংশ, ক্ষয় ও ক্ষতি পরীক্ষা করুন।","পরিষ্কার, লেবেলযুক্ত, সঠিকভাবে পৃথক ও উপচে না-পড়া বর্জ্য বিন ব্যবহার করুন।"],
    Standardize: ["প্রত্যাশিত অবস্থা এক নজরে যাচাই করতে কর্মস্থলে স্পষ্ট 5S মান প্রদর্শন করুন।","ছবির নির্দেশনায় পদ্ধতি, সরঞ্জাম, সময়কাল ও প্রত্যাশিত ফল দেখান।","প্রতিটি কাজের নামযুক্ত দায়িত্বশীল ব্যক্তিসহ এলাকা মালিকানা দেখান।","দ্রুত তুলনার জন্য সঠিক কর্মস্থল অবস্থার অনুমোদিত ছবি প্রদর্শন করুন।","লেবেল, মেঝে চিহ্ন, স্ট্যাটাস বোর্ড ও নির্ধারিত স্থান একইভাবে বজায় রাখুন।","ট্যাগ, সংকেত বা ত্রুটি চিহ্ন দিয়ে অস্বাভাবিক অবস্থা সঙ্গে সঙ্গে দৃশ্যমান করুন।","দলের সঙ্গে মান পর্যালোচনা করে পরিবর্তন, ফলাফল ও পদক্ষেপ নথিভুক্ত করুন।"],
    Sustain: ["কর্মীরা প্রতিদিন নির্ধারিত স্থান, নিয়ন্ত্রণ ও কর্মস্থলের মান ধারাবাহিকভাবে অনুসরণ করবে।","প্রতিটি অডিট ফলাফল মালিক ও তারিখসহ যাচাইকৃত সমাপ্তি পর্যন্ত অনুসরণ করুন।","পুনরাবৃত্তি শনাক্ত ও স্থায়ী প্রতিকার নিশ্চিত করতে দৃশ্যমান ট্র্যাকিং ব্যবহার করুন।","অনুমোদিত চেকলিস্টে নির্ধারিত অডিট করে পরিদর্শনস্থলেই ফল নথিভুক্ত করুন।","কর্মস্থলের উদাহরণ দিয়ে ব্যবহারিক 5S প্রশিক্ষণ দিন এবং বোঝাপড়া নিশ্চিত করুন।","কাইজেন ধারণা, মালিক, পর্যালোচনা ও বাস্তবায়নের অবস্থা দৃশ্যমান করুন।","বর্তমান 5S স্কোর, প্রবণতা, অগ্রাধিকার ও পদক্ষেপ উৎপাদন এলাকায় দেখান।","দৈনিক মালিকানা বোর্ড হালনাগাদ করে নির্ধারিত পরীক্ষা সম্পন্ন হওয়া নিশ্চিত করুন।"],
  },
  ja: {
    Sort: ["現在の作業に必要な物だけを残し、不要な材料、箱、工具、旧品を撤去します。","旧式・破損・未使用の工具を識別し、管理されたレッドタグ区域へ移します。","原材料を表示された場所で定められた最小・最大数量内に保ちます。","不合格品とスクラップを良品在庫から分離し、表示された区域に収容します。","レッドタグ品の状態を明示し、処置決定まで指定区域で管理します。","生産文書台には最新版の管理された作業指示書と帳票だけを置きます。","私物は生産区域から離れた指定ロッカーに保管します。"],
    "Set in Order": ["頻繁に使う工具と材料には、使用場所の近くに明確な定位置を設けます。","棚、ラック、容器に読みやすい表示を付け、保管場所を明確にします。","工具を輪郭表示されたシャドーボードに配置し、欠品を一目で分かるようにします。","床、棚、容器の表示で物品の正しい置き場所を示します。","最小・最大またはかんばん数量を表示し、過不足を見える化します。","歩行通路を連続して明確に表示し、障害物を置きません。","非常設備を塞がず、目立つ床・壁表示で場所を明確にします。","仕掛品を表示と境界線のある所定の仮置き区域内に置きます。","治具を保護された表示付きラックの定位置に保管します。"],
    Shine: ["床、作業台、生産周辺を清潔にし、ごみや目に見える汚れをなくします。","機械表面に油、切粉、ほこり、残留物を蓄積させません。","清掃責任板で、各区域の担当者と点検内容を明確にします。","作業、頻度、担当者、完了状況を示す最新の清掃予定を掲示します。","漏れやこぼれを直ちに封じ込めて清掃し、発生源を是正します。","清掃用具を輪郭表示された専用ステーションに保管します。","清掃時に漏れ、緩み、摩耗、損傷などの異常も点検します。","清潔で表示・分別され、あふれていないごみ箱を使用します。"],
    Standardize: ["期待状態を一目で確認できる明確な5S基準を職場に掲示します。","清掃方法、用具、頻度、期待結果を写真付き標準書で示します。","区域の所有者と各作業の責任者を氏名付きで明確にします。","正しい職場状態の承認写真を掲示し、すぐ比較できるようにします。","ラベル、床表示、状態板、定位置を一貫して維持します。","タグ、状態信号、不良マーカーで異常を直ちに見える化します。","チームで基準を定期的に見直し、変更、指摘、対策を記録します。"],
    Sustain: ["従業員が定位置、管理方法、作業場基準を日々一貫して守ります。","すべての監査指摘を、担当者と日付を付けて検証済み完了まで追跡します。","再発を見つけ恒久対策を確認できるよう是正処置を見える化します。","承認済みチェックリストで定期監査を行い、現場で指摘を記録します。","職場の実例を使った実践的な5S教育を行い、理解を確認します。","改善提案、担当者、審査、実施状況を見えるようにします。","最新の5S点数、傾向、優先事項、対策を生産現場に掲示します。","日常5S責任板を更新し、担当点検が確実に完了するようにします。"],
  },
};

export function referenceFields(category: FiveSCategory, index: number): ReferenceFields {
  const slug = slugs[category];
  const number = String(index + 1).padStart(2, "0");
  const keyRoot = `questions.${slug}.q${index + 1}`;
  return {
    referenceImage: `/demo-5s/reference-images/${slug}/${slug}-${number}.webp`,
    referenceTitleKey: `${keyRoot}.referenceTitle`,
    referenceGuidanceKey: `${keyRoot}.referenceGuidance`,
    referenceAltKey: `${keyRoot}.referenceAlt`,
  };
}

const keyPattern = /^questions\.(sort|set-in-order|shine|standardize|sustain)\.q(\d+)\.(referenceTitle|referenceGuidance|referenceAlt)$/;
const categoryBySlug = Object.fromEntries(Object.entries(slugs).map(([category, slug]) => [slug, category])) as Record<string, FiveSCategory>;

export function referenceText(language: AppLanguage, key: string | undefined): string {
  const match = key?.match(keyPattern);
  if (!match) return "";
  const category = categoryBySlug[match[1]];
  const index = Number(match[2]) - 1;
  const [title, guidance] = en[category]?.[index] ?? ["Reference", ""];
  const localizedGuidance = language === "en" ? guidance : translatedGuidance[language][category][index] || `${languageLead[language]}${guidance}`;
  if (match[3] === "referenceTitle") return language === "en" ? title : localizedGuidance.split(/[।。.!]/)[0];
  if (match[3] === "referenceAlt") return localizedGuidance;
  return localizedGuidance;
}

export const REFERENCE_COUNTS = { Sort: 7, "Set in Order": 9, Shine: 8, Standardize: 7, Sustain: 8 } as const;
