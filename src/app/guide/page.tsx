
'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/components/language-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Wheat, Search, TrendingUp, MapPin, Info, ShoppingBag, Lightbulb, CheckCircle2, Sprout, FlaskConical, Bug, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';

// Consolidated Chart Component to ensure visibility and fix hydration issues
const PieChartComponent = dynamic(
  () => import('recharts').then((mod) => {
    const { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } = mod;
    return function Chart({ data, colors, type }: any) {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name} (${value}%)`}
              outerRadius={110}
              innerRadius={60}
              paddingAngle={5}
              dataKey="value"
              nameKey="name"
              animationBegin={300}
              animationDuration={1500}
            >
              {data.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.15)', padding: '16px' }}
              itemStyle={{ fontWeight: 'bold', fontSize: '14px' }}
              formatter={(val) => [`${val}%`, type === 'production' ? 'Production Share' : 'Sales Share']}
            />
            <Legend verticalAlign="bottom" height={40} wrapperStyle={{ paddingTop: '20px' }} />
          </PieChart>
        </ResponsiveContainer>
      );
    };
  }),
  { 
    ssr: false, 
    loading: () => (
      <div className="flex items-center justify-center h-full w-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary/30" />
      </div>
    ) 
  }
);

const COLORS = ['#166534', '#f59e0b', '#3b82f6', '#f97316', '#a855f7', '#64748b'];

const translations = {
  en: {
    title: 'Maharashtra Crop Insights',
    description: 'Data-driven insights for farmers. Explore regional production trends, market hubs, and expert cultivation protocols.',
    searchPlaceholder: 'Search crops (e.g. Sugarcane, Mango, Wheat)...',
    majorDistricts: 'Core Production Districts',
    majorMarkets: 'Top Regional Markets',
    stats: 'Regional Data',
    stateProduction: 'Total Yield',
    stateSalesValue: 'Market Value (Est.)',
    nationalShare: 'National Contribution',
    noCropsFound: 'No results found for your search.',
    chartTitleProduction: 'Production Distribution (%)',
    chartTitleSales: 'Market Value Distribution (%)',
    production: 'Yield Data',
    sales: 'Economy',
    tips: 'Protocols',
    farmingGuide: 'Cultivation Protocol',
    prepTitle: 'Soil & Land Prep',
    fertTitle: 'Nutrition Schedule',
    pestTitle: 'Plant Protection',
  },
  mr: {
    title: 'महाराष्ट्र पीक मार्गदर्शक',
    description: 'शेतकऱ्यांसाठी डेटा-आधारित माहिती. प्रादेशिक उत्पादन कल, बाजारपेठा आणि तज्ज्ञ लागवड पद्धती जाणून घ्या.',
    searchPlaceholder: 'पिके शोधा (उदा. ऊस, आंबा, गहू)...',
    majorDistricts: 'प्रमुख उत्पादक जिल्हे',
    majorMarkets: 'प्रमुख प्रादेशिक बाजारपेठा',
    stats: 'प्रादेशिक आकडेवारी',
    stateProduction: 'एकूण उत्पादन',
    stateSalesValue: 'अंदाजे बाजार मूल्य',
    nationalShare: 'राष्ट्रीय वाटा',
    noCropsFound: 'तुमच्या शोधाशी जुळणारी पिके सापडली नाहीत.',
    chartTitleProduction: 'उत्पादन वितरण (%)',
    chartTitleSales: 'बाजार मूल्य वितरण (%)',
    production: 'उत्पादन डेटा',
    sales: 'अर्थशास्त्र',
    tips: 'लागवड पद्धती',
    farmingGuide: 'लागवड मार्गदर्शन',
    prepTitle: 'जमीन आणि तयारी',
    fertTitle: 'पोषण वेळापत्रक',
    pestTitle: 'कीड आणि रोग नियंत्रण',
  }
};

const cropData = [
  {
    id: 'sugarcane',
    name: { en: 'Sugarcane', mr: 'ऊस' },
    imageId: 'sugarcane-guide',
    production: {
      districts: { en: 'Kolhapur, Sangli, Satara, Pune, Ahmednagar', mr: 'कोल्हापूर, सांगली, सातारा, पुणे, अहमदनगर' },
      value: '124.4 Million Tonnes',
      share: '32.1%',
      description: { en: 'Maharashtra is a leading producer of sugar in India, with western districts being the heart of production.', mr: 'महाराष्ट्र हे भारतातील साखरेचे प्रमुख उत्पादक असून पश्चिम महाराष्ट्रातील जिल्हे उत्पादनाचे केंद्र आहेत.' },
      chart: [
        { name: 'Kolhapur', value: 22.5 },
        { name: 'Sangli', value: 18.2 },
        { name: 'Pune', value: 15.5 },
        { name: 'Ahmednagar', value: 14.8 },
        { name: 'Others', value: 29.0 },
      ]
    },
    sales: {
      markets: { en: 'Kolhapur, Pune, Solapur, Sangli', mr: 'कोल्हापूर, पुणे, सोलापूर, सांगली' },
      value: '₹42,500 Crores',
      share: '35.2%',
      description: { en: 'Sugarcane sales are primarily handled through the sugar factory cooperative network across the state.', mr: 'उसाची विक्री प्रामुख्याने राज्यातील साखर कारखाना सहकारी नेटवर्कद्वारे हाताळली जाते.' },
      chart: [
        { name: 'Kolhapur', value: 28.5 },
        { name: 'Sangli', value: 20.2 },
        { name: 'Pune', value: 18.5 },
        { name: 'Satara', value: 12.8 },
        { name: 'Others', value: 20.0 },
      ]
    },
    cultivation: {
      prep: [
        { en: 'Deep ploughing (30-45 cm) followed by 2-3 harrowings.', mr: '३०-४५ सेंमी खोल नांगरणी करून २-३ वेळा कुळवाच्या पाळ्या द्या.' },
        { en: 'Apply 25-50 tonnes of FYM or compost per hectare.', mr: 'हेक्टरी २५-५० टन शेणखत किंवा कंपोस्ट खत टाका.' }
      ],
      fert: [
        { en: 'Standard NPK ratio: 250:115:115 kg/ha.', mr: 'प्रमाणित नत्र:स्फुरद:पालाश गुणोत्तर: २५०:११५:११५ किलो/हेक्टर.' },
        { en: 'Apply Urea in 4 split doses: at planting, 6, 12, and 36 weeks.', mr: 'युरिया ४ हप्त्यांत द्या: लागवडीवेळी, ६, १२ आणि ३६ व्या आठवड्यात.' }
      ],
      pests: [
        { en: 'Stem Borer: Look for drying central shoots (dead hearts).', mr: 'खोडकिडा: मुख्य कोंब सुकल्याचे (डेड हार्ट) तपासा.' },
        { en: 'Whitefly and Pyrilla: Monitor during high humidity periods.', mr: 'पांढरी माशी आणि पाकोळी: अति आर्द्रतेच्या काळात लक्ष ठेवा.' }
      ]
    }
  },
  {
    id: 'onion',
    name: { en: 'Onion', mr: 'कांदा' },
    imageId: 'onion-guide',
    production: {
      districts: { en: 'Nashik, Ahmednagar, Pune, Solapur, Dhule', mr: 'नाशिक, अहमदनगर, पुणे, सोलापूर, धुळे' },
      value: '13.5 Million Tonnes',
      share: '43.2%',
      description: { en: 'Nashik district alone contributes a significant portion of India\'s total onion production.', mr: 'नाशिक जिल्हा एकटाच भारताच्या एकूण कांदा उत्पादनात मोठा वाटा उचलतो.' },
      chart: [
        { name: 'Nashik', value: 45.2 },
        { name: 'Ahmednagar', value: 16.5 },
        { name: 'Pune', value: 12.2 },
        { name: 'Solapur', value: 8.8 },
        { name: 'Others', value: 17.3 },
      ]
    },
    sales: {
      markets: { en: 'Lasalgaon (Nashik), Pune, Solapur, Mumbai', mr: 'लासलगाव (नाशिक), पुणे, सोलापूर, मुंबई' },
      value: '₹18,200 Crores',
      share: '48.5%',
      description: { en: 'Lasalgaon in Nashik is Asia\'s largest onion market, dictating prices across the country.', mr: 'नाशिकमधील लासलगाव ही आशियातील सर्वात मोठी कांदा बाजारपेठ आहे, जो देशभरातील भाव ठरवते.' },
      chart: [
        { name: 'Nashik', value: 55.2 },
        { name: 'Pune', value: 15.5 },
        { name: 'Ahmednagar', value: 10.2 },
        { name: 'Solapur', value: 9.1 },
        { name: 'Others', value: 10.0 },
      ]
    },
    cultivation: {
      prep: [
        { en: 'Prepare fine tilth beds. Nursery sowing 6-8 weeks before transplanting.', mr: 'गादी वाफे तयार करा. पुनर्लागवडीच्या ६-८ आठवड्यांपूर्वी रोपवाटिकेत बियाणे टाका.' },
        { en: 'Ideal pH range: 6.0 to 7.5.', mr: 'जमिनीचा सामू (pH): ६.० ते ७.५ दरम्यान असावा.' }
      ],
      fert: [
        { en: 'Basal dose of 50:50:50 kg NPK per hectare.', mr: 'लागवडीवेळी ५०:५०:५० किलो नत्र:स्फुरद:पालाश प्रति हेक्टर द्या.' },
        { en: 'Top dress with 50 kg Nitrogen 30 days after transplanting.', mr: 'पुनर्लागवडीनंतर ३० दिवसांनी ५० किलो नत्राचा हप्ता द्या.' },
        { en: 'Sulphur (20kg/ha) improves bulb pungency and storage.', mr: 'गंधक (२० किलो/हेक्टर) कांद्याचा तिखटपणा आणि साठवणूक क्षमता सुधारते.' }
      ],
      pests: [
        { en: 'Thrips: Small white specks on leaves. Use Neem-based sprays.', mr: 'फुलकिडे (थ्रिप्स): पानांवर पांढरे ठिपके. निंबोळी अर्काची फवारणी करा.' },
        { en: 'Purple Blotch: Fungal disease causing purple spots on leaves.', mr: 'जांभळा करपा: पानांवर जांभळट ठिपके पडणारा बुरशीजन्य रोग.' }
      ]
    }
  },
  {
    id: 'cotton',
    name: { en: 'Cotton', mr: 'कापूस' },
    imageId: 'cotton-guide',
    production: {
      districts: { en: 'Jalgaon, Yavatmal, Akola, Amravati, Buldhana', mr: 'जळगाव, यवतमाळ, अकोला, अमरावती, बुलढाणा' },
      value: '8.2 Million Bales',
      share: '24.5%',
      description: { en: 'Widely grown in Vidarbha and Marathwada regions, often called "White Gold".', mr: 'विदर्भ आणि मराठवाडा भागात मोठ्या प्रमाणावर घेतले जाणारे पीक, ज्याला "पांढरे सोने" म्हटले जाते.' },
      chart: [
        { name: 'Yavatmal', value: 20.4 },
        { name: 'Jalgaon', value: 18.5 },
        { name: 'Akola', value: 15.2 },
        { name: 'Amravati', value: 12.8 },
        { name: 'Others', value: 33.1 },
      ]
    },
    sales: {
      markets: { en: 'Akola, Jalgaon, Nagpur, Yavatmal', mr: 'अकोला, जळगाव, नागपूर, यवतमाळ' },
      value: '₹12,800 Crores',
      share: '22.1%',
      description: { en: 'Cotton sales are driven by industrial demand from textile hubs across western India.', mr: 'देशभरातील कापड केंद्रांकडून औद्योगिक मागणीमुळे कापसाच्या विक्रीला चालना मिळते.' },
      chart: [
        { name: 'Akola', value: 25.4 },
        { name: 'Jalgaon', value: 22.5 },
        { name: 'Yavatmal', value: 18.2 },
        { name: 'Nagpur', value: 14.8 },
        { name: 'Others', value: 19.1 },
      ]
    },
    cultivation: {
      prep: [
        { en: 'Deep ploughing once in two years. Summer ploughing helps kill pests.', mr: 'दोन वर्षांतून एकदा खोल नांगरणी. उन्हाळी नांगरणीमुळे कीड मरण्यास मदत होते.' },
        { en: 'Sow at the onset of monsoon for maximum rain-fed yield.', mr: 'कोरडवाहू उत्पादनासाठी मान्सूनच्या सुरुवातीलाच पेरणी करा.' }
      ],
      fert: [
        { en: '100:50:50 kg NPK/ha for rain-fed varieties.', mr: 'कोरडवाहू जातींसाठी १००:५०:५० किलो नत्र:स्फुरद:पालाश प्रति हेक्टर.' },
        { en: 'Apply Nitrogen in two splits: at 30 and 60 days after sowing.', mr: 'नत्राचा हप्ता दोन वेळा द्या: पेरणीनंतर ३० आणि ६० दिवसांनी.' }
      ],
      pests: [
        { en: 'Pink Bollworm: Monitor using pheromone traps. Collect dropped squares.', mr: 'गुलाबी बोंडअळी: कामगंध सापळ्यांचा वापर करा. गळलेली फुले/बोंडे गोळा करा.' },
        { en: 'Jassids and Aphids: Sucking pests causing leaf curling.', mr: 'तुडतुडे आणि मावा: पाने आकसण्यास कारणीभूत ठरणारी रसशोषक कीड.' }
      ]
    }
  },
  {
    id: 'soybean',
    name: { en: 'Soybean', mr: 'सोयाबीन' },
    imageId: 'soybean-guide',
    production: {
      districts: { en: 'Latur, Nanded, Buldhana, Washim, Nagpur', mr: 'लातूर, नांदेड, बुलढाणा, वाशीम, नागपूर' },
      value: '6.5 Million Tonnes',
      share: '34.8%',
      description: { en: 'Soybean has emerged as a major cash crop in the Marathwada and Vidarbha regions.', mr: 'मराठवाडा आणि विदर्भ भागात सोयाबीन हे प्रमुख नगदी पीक म्हणून उदयास आले आहे.' },
      chart: [
        { name: 'Latur', value: 22.1 },
        { name: 'Buldhana', value: 18.4 },
        { name: 'Nanded', value: 16.5 },
        { name: 'Washim', value: 12.2 },
        { name: 'Others', value: 30.8 },
      ]
    },
    sales: {
      markets: { en: 'Latur, Nanded, Akola, Nagpur', mr: 'लातूर, नांदेड, अकोला, नागपूर' },
      value: '₹15,400 Crores',
      share: '31.2%',
      description: { en: 'Latur is a major trading hub for Soybean, processing it for oil and animal feed.', mr: 'लातूर हे सोयाबीनचे प्रमुख व्यापारी केंद्र असून तेथे तेल आणि पशुखाद्यासाठी प्रक्रिया केली जाते.' },
      chart: [
        { name: 'Latur', value: 35.1 },
        { name: 'Nanded', value: 20.4 },
        { name: 'Akola', value: 15.5 },
        { name: 'Washim', value: 10.2 },
        { name: 'Others', value: 18.8 },
      ]
    },
    cultivation: {
      prep: [
        { en: 'One deep ploughing and two harrowings to get fine tilth.', mr: 'एक खोल नांगरणी और दोनदा कुळवाच्या पाळ्या देऊन जमीन भुसभुशीत करा.' },
        { en: 'Seed treatment with Rhizobium and PSB is mandatory for nitrogen fixation.', mr: 'नत्र स्थिरीकरणासाठी रायझोबियम आणि पीएसबीची बीजप्रक्रिया अनिवार्य आहे.' }
      ],
      fert: [
        { en: 'Fertilizer dose: 20:80:20 kg NPK per hectare.', mr: 'खताची मात्रा: २०:८०:२० किलो नत्र:स्फुरद:पालाश प्रति हेक्टर.' },
        { en: 'Phosphorus is critical for pod development.', mr: 'शेंगांच्या वाढीसाठी स्फुरद अत्यंत आवश्यक आहे.' }
      ],
      pests: [
        { en: 'Girdle Beetle: Stems are cut in circles. Remove infested parts early.', mr: 'चक्रीभुंगा: खोडावर गोल काप घेतो. प्रादुर्भावग्रस्त भाग सुरुवातीलाच काढून टाका.' },
        { en: 'Semilooper: Defoliating caterpillars. Monitor during flowering.', mr: 'उंट अळी: पाने खाणारी अळी. फुलोऱ्याच्या काळात लक्ष ठेवा.' }
      ]
    }
  },
  {
    id: 'grapes',
    name: { en: 'Grapes', mr: 'द्राक्षे' },
    imageId: 'grapes-guide',
    production: {
      districts: { en: 'Nashik, Sangli, Solapur, Pune', mr: 'नाशिक, सांगली, सोलापूर, पुणे' },
      value: '2.4 Million Tonnes',
      share: '81.2%',
      description: { en: 'Maharashtra is the grape capital of India, with Nashik being world-renowned for its quality.', mr: 'महाराष्ट्र ही भारताची द्राक्षांची राजधानी असून नाशिक जिल्हा गुणवत्तेसाठी जगप्रसिद्ध आहे.' },
      chart: [
        { name: 'Nashik', value: 65.5 },
        { name: 'Sangli', value: 15.8 },
        { name: 'Solapur', value: 10.2 },
        { name: 'Pune', value: 5.5 },
        { name: 'Others', value: 3.0 },
      ]
    },
    sales: {
      markets: { en: 'Nashik, Pune, Mumbai (Exports), Sangli', mr: 'नाशिक, पुणे, मुंबई (निर्यात), सांगली' },
      value: '₹9,800 Crores',
      share: '85.5%',
      description: { en: 'A large percentage of Nashik grapes are exported globally, especially to Europe.', mr: 'नाशिकच्या द्राक्षांची मोठी टक्केवारी जागतिक स्तरावर, विशेषतः युरोपमध्ये निर्यात केली जाते.' },
      chart: [
        { name: 'Nashik', value: 70.5 },
        { name: 'Sangli', value: 12.8 },
        { name: 'Mumbai', value: 10.2 },
        { name: 'Pune', value: 4.5 },
        { name: 'Others', value: 2.0 },
      ]
    },
    cultivation: {
      prep: [
        { en: 'Orient rows North-South for maximum sunlight. Use Y-trellis system.', mr: 'भरपूर सूर्यप्रकाशासाठी ओळी उत्तर-दक्षिण ठेवा. वाय-ट्रेलीस पद्धत वापरा.' },
        { en: 'Two prunings: Back pruning (Apr) and Fruit pruning (Oct).', mr: 'वर्षातून दोनदा छाटणी: एप्रिल छाटणी (पाया) आणि ऑक्टोबर छाटणी (फळ).' }
      ],
      fert: [
        { en: 'Balanced NPK based on soil/petiole testing. Micronutrients (Zn, Fe, B) are vital.', mr: 'माती/देठ परीक्षणावर आधारित संतुलित खते द्या. सूक्ष्मद्रव्ये (जस्त, लोह, बोरोन) महत्त्वाची आहेत.' },
        { en: 'Use drip fertigation for uniform nutrient distribution.', mr: 'एकसमान खत वितरणासाठी ठिबकद्वारे फर्टिगेशनचा वापर करा.' }
      ],
      pests: [
        { en: 'Mealybugs: White cottony growth on bunches. Maintain sanitation.', mr: 'पिठ्या ढेकूण: घडांवर पांढरी कापूससदृश वाढ. बागेत स्वच्छता ठेवा.' },
        { en: 'Downy Mildew: Fungal disease during wet weather. Regular protective sprays.', mr: 'केवडा (डाउनी मिल्ड्यू): ओल्या हवामानातील बुरशीजन्य रोग. नियमित प्रतिबंधात्मक फवारण्या करा.' }
      ]
    }
  },
  {
    id: 'pomegranate',
    name: { en: 'Pomegranate', mr: 'डाळिंब' },
    imageId: 'pomegranate-guide',
    production: {
      districts: { en: 'Solapur, Nashik, Sangli, Ahmednagar, Pune', mr: 'सोलापूर, नाशिक, सांगली, अहमदनगर, पुणे' },
      value: '1.8 Million Tonnes',
      share: '75.4%',
      description: { en: 'Maharashtra dominates pomegranate production, especially the "Bhagwa" variety.', mr: 'डाळिंब उत्पादनात महाराष्ट्र अग्रेसर असून विशेषतः "भगवा" जातीसाठी प्रसिद्ध आहे.' },
      chart: [
        { name: 'Solapur', value: 42.5 },
        { name: 'Nashik', value: 25.8 },
        { name: 'Sangli', value: 12.2 },
        { name: 'Ahmednagar', value: 8.5 },
        { name: 'Others', value: 11.0 },
      ]
    },
    sales: {
      markets: { en: 'Solapur, Nashik, Mumbai, Export Hubs', mr: 'सोलापूर, नाशिक, मुंबई, निर्यात केंद्र' },
      value: '₹6,400 Crores',
      share: '78.2%',
      description: { en: 'Large quantities are exported to Middle East and European markets.', mr: 'मोठ्या प्रमाणावर आखाती देश और युरोपियन बाजारपेठांमध्ये निर्यात केली जाते.' },
      chart: [
        { name: 'Solapur', value: 45.5 },
        { name: 'Mumbai', value: 20.8 },
        { name: 'Nashik', value: 15.2 },
        { name: 'Sangli', value: 10.5 },
        { name: 'Others', value: 8.0 },
      ]
    },
    cultivation: {
      prep: [
        { en: 'Deep loamy soil with good drainage is ideal. Spacing: 4.5m x 3m.', mr: 'चांगला निचरा होणारी खोल जमीन निवडा. लागवडीचे अंतर: ४.५ मी x ३ मी.' },
        { en: 'Plant during monsoon or Feb-March for best establishment.', mr: 'मान्सूनमध्ये किंवा फेब्रुवारी-मार्चमध्ये लागवड करणे उत्तम.' }
      ],
      fert: [
        { en: '600:250:250 g NPK per full-grown tree annually.', mr: 'पूर्ण वाढलेल्या झाडासाठी ६००:२५०:२५० ग्रॅम नत्र:स्फुरद:पालाश प्रति वर्ष.' },
        { en: 'Apply micronutrients like Boron and Zinc after pruning.', mr: 'छाटणीनंतर बोरॉन आणि जस्त सारखी सूक्ष्मद्रव्ये द्या.' }
      ],
      pests: [
        { en: 'Oily Spot (Bacterial Blight): Look for water-soaked spots on fruits.', mr: 'तेलकट डाग (बॅक्टेरियल ब्लाइट): फळांवर पाणीदार डाग तपासा.' },
        { en: 'Fruit Borer: Causes holes in fruits. Use light traps.', mr: 'फळ पोखरणारी अळी: फळांना छिद्रे पाडते. प्रकाश सापळ्यांचा वापर करा.' }
      ]
    }
  },
  {
    id: 'turmeric',
    name: { en: 'Turmeric', mr: 'हळद' },
    imageId: 'turmeric-guide',
    production: {
      districts: { en: 'Sangli, Hingoli, Nanded, Satara, Parbhani', mr: 'सांगली, हिंगोली, नांदेड, सातारा, परभणी' },
      value: '0.45 Million Tonnes',
      share: '18.5%',
      description: { en: 'Sangli is world-famous for its turmeric trade and high curcumin content.', mr: 'सांगली हळद व्यापारासाठी और उच्च कर्क्यूमिन प्रमाणामुळे जगप्रसिद्ध आहे.' },
      chart: [
        { name: 'Sangli', value: 35.5 },
        { name: 'Hingoli', value: 22.8 },
        { name: 'Nanded', value: 15.2 },
        { name: 'Satara', value: 10.5 },
        { name: 'Others', value: 16.0 },
      ]
    },
    sales: {
      markets: { en: 'Sangli (Major Hub), Hingoli, Mumbai', mr: 'सांगली (प्रमुख केंद्र), हिंगोली, मुंबई' },
      value: '₹4,200 Crores',
      share: '22.1%',
      description: { en: 'Sangli market yard dictates the price of turmeric across South Asia.', mr: 'सांगली मार्केट यार्ड दक्षिण आशियातील हळदीचे भाव ठरवते.' },
      chart: [
        { name: 'Sangli', value: 55.5 },
        { name: 'Hingoli', value: 18.8 },
        { name: 'Parbhani', value: 10.2 },
        { name: 'Satara', value: 8.5 },
        { name: 'Others', value: 7.0 },
      ]
    },
    cultivation: {
      prep: [
        { en: 'Raised bed method (BBF) recommended for better drainage.', mr: 'रुंद वरंबा-सरी (BBF) पद्धत निचरा होण्यासाठी शिफारसीय आहे.' },
        { en: 'Seed treatment: Trichoderma + Carbendazim before planting.', mr: 'बीजप्रक्रिया: लागवडीपूर्वी ट्रायकोडर्मा + कार्बेन्डाझिम वापरा.' }
      ],
      fert: [
        { en: 'Basal dose: 25 tonnes FYM + 40:40:40 kg NPK per ha.', mr: 'पायाभूत मात्रा: २५ टन शेणखत + ४०:४०:४० किलो नत्र:स्फुरद:पालाश प्रति हेक्टर.' },
        { en: 'Second N dose (40kg) at 120 days after planting.', mr: 'लागवडीनंतर १२० दिवसांनी नत्राचा दुसरा हप्ता (४० किलो) द्या.' }
      ],
      pests: [
        { en: 'Rhizome Rot: Fungal disease during water stagnation.', mr: 'कंदकुज: पाणी साठल्यामुळे होणारा बुरशीजन्य रोग.' },
        { en: 'Leaf Roller: Caterpillars that roll and eat leaves.', mr: 'पाने गुंडाळणारी अळी: पाने गुंडाळून खाणारी अळी.' }
      ]
    }
  },
  {
    id: 'mango',
    name: { en: 'Mango (Alphonso)', mr: 'आंबा (हापूस)' },
    imageId: 'mango-guide',
    production: {
      districts: { en: 'Ratnagiri, Sindhudurg, Raigad, Palghar', mr: 'रत्नागिरी, सिंधुदुर्ग, रायगड, पालघर' },
      value: '0.8 Million Tonnes',
      share: '12.2%',
      description: { en: 'Konkan region is the exclusive home of the world-famous GI-tagged Alphonso mango.', mr: 'जागतिक स्तरावर प्रसिद्ध असलेल्या जीआय-टॅग प्राप्त हापूस आंब्याचे कोकण हे मूळ स्थान आहे.' },
      chart: [
        { name: 'Ratnagiri', value: 48.5 },
        { name: 'Sindhudurg', value: 32.8 },
        { name: 'Raigad', value: 12.2 },
        { name: 'Palghar', value: 4.5 },
        { name: 'Others', value: 2.0 },
      ]
    },
    sales: {
      markets: { en: 'Mumbai (Vashi), Pune, Exports (USA, Europe)', mr: 'मुंबई (वाशी), पुणे, निर्यात (अमेरिका, युरोप)' },
      value: '₹5,800 Crores',
      share: '15.5%',
      description: { en: 'Export markets fetch premium prices for high-quality Konkan Alphonso.', mr: 'उच्च दर्जाच्या कोकण हापूससाठी निर्यात बाजारपेठेत प्रीमियम भाव मिळतो.' },
      chart: [
        { name: 'Mumbai', value: 60.5 },
        { name: 'Pune', value: 15.8 },
        { name: 'Exports', value: 18.2 },
        { name: 'Sindhudurg', value: 3.5 },
        { name: 'Others', value: 2.0 },
      ]
    },
    cultivation: {
      prep: [
        { en: 'Laterite soils of Konkan are ideal. Dig pits of 1m x 1m x 1m.', mr: 'कोकणातील जांभा जमीन आदर्श आहे. १मी x १मी x १मी आकाराचे खड्डे खणा.' },
        { en: 'Fill pits with soil, FYM, and single super phosphate.', mr: 'खड्डे माती, शेणखत आणि सिंगल सुपर फॉस्फेटने भरा.' }
      ],
      fert: [
        { en: 'Apply 1kg N, 0.5kg P, 1kg K per full-grown tree annually.', mr: 'पूर्ण वाढलेल्या झाडाला दरवर्षी १ किलो नत्र, ०.५ किलो स्फुरद, १ किलो पालाश द्या.' },
        { en: 'Paclobutrazol application in Sept for regular flowering.', mr: 'नियमित मोहोर येण्यासाठी सप्टेंबरमध्ये पॅक्लोब्युट्राझोलचा वापर करा.' }
      ],
      pests: [
        { en: 'Mango Hopper: Sucks sap from flowers. Use Metarhizium anisopliae.', mr: 'तुडतुडे (आंबा हॉपर): फुलांतील रस शोषतात. मेटारायझियम अ‍ॅनिोसोप्लीचा वापर करा.' },
        { en: 'Fruit Fly: Monitor during ripening stage using methyl eugenol traps.', mr: 'फळमाशी: फळ पिकण्याच्या काळात मिथिल युजेनॉल सापळ्यांनी निरीक्षण करा.' }
      ]
    }
  },
  {
    id: 'rice',
    name: { en: 'Rice', mr: 'भात' },
    imageId: 'rice-guide',
    production: {
      districts: { en: 'Raigad, Ratnagiri, Sindhudurg, Bhandara, Gondia', mr: 'रायगड, रत्नागिरी, सिंधुदुर्ग, भंडारा, गोंदिया' },
      value: '3.5 Million Tonnes',
      share: '3.2%',
      description: { en: 'Rice is the staple crop of Konkan and eastern Vidarbha districts.', mr: 'कोकण आणि पूर्व विदर्भातील जिल्ह्यांचे भात हे प्रमुख पीक आहे.' },
      chart: [
        { name: 'Bhandara', value: 25.5 },
        { name: 'Gondia', value: 22.8 },
        { name: 'Raigad', value: 18.2 },
        { name: 'Ratnagiri', value: 15.5 },
        { name: 'Others', value: 18.0 },
      ]
    },
    sales: {
      markets: { en: 'Bhandara, Gondia, Mumbai (Raigad supply), Panvel', mr: 'भंडारा, गोंदिया, मुंबई (रायगड पुरवठा), पनवेल' },
      value: '₹12,200 Crores',
      share: '4.5%',
      description: { en: 'Vidarbha rice markets are major hubs for trading long-grain varieties.', mr: 'विदर्भातील भात बाजारपेठा लांब दाण्याच्या जातींच्या व्यापारासाठी मोठी केंद्रे आहेत.' },
      chart: [
        { name: 'Gondia', value: 30.5 },
        { name: 'Bhandara', value: 28.8 },
        { name: 'Panvel', value: 15.2 },
        { name: 'Mumbai', value: 12.5 },
        { name: 'Others', value: 13.0 },
      ]
    },
    cultivation: {
      prep: [
        { en: 'Puddling is essential for transplanting. Nursery preparation in May.', mr: 'पुनर्लागवडीसाठी चिखलणी आवश्यक आहे. मे महिन्यात रोपवाटिका तयार करा.' },
        { en: 'Maintain 2-5cm water level during vegetative stage.', mr: 'वाढीच्या काळात २-५ सेंमी पाणी पातळी राखा.' }
      ],
      fert: [
        { en: 'Standard dose: 100:50:50 kg NPK per hectare.', mr: 'प्रमाणित मात्रा: १००:५०:५० किलो नत्र:स्फुरद:पालाश प्रति हेक्टर.' },
        { en: 'Use Urea Briquettes for deep placement in Konkan region.', mr: 'कोकणात खोलवर खत देण्यासाठी युरिया ब्रिकेट्सचा वापर करा.' }
      ],
      pests: [
        { en: 'Stem Borer: Causes white ear heads. Use Cartap Hydrochloride.', mr: 'खोडकिडा: पांढरी लोंबी येण्यास कारणीभूत. कार्टाप हायड्रोक्लोराईड वापरा.' },
        { en: 'Rice Blast: Fungal spots on leaves. Monitor during cloudy weather.', mr: 'करपा (ब्लास्ट): पानांवर बुरशीजन्य ठिपके. ढगाळ हवामानात लक्ष ठेवा.' }
      ]
    }
  },
  {
    id: 'jowar',
    name: { en: 'Jowar (Sorghum)', mr: 'ज्वारी' },
    imageId: 'jowar-guide',
    production: {
      districts: { en: 'Solapur, Sangli, Ahmednagar, Pune, Parbhani', mr: 'सोलापूर, सांगली, अहमदनगर, पुणे, परभणी' },
      value: '1.2 Million Tonnes',
      share: '28.5%',
      description: { en: 'Jowar is a major food staple in Maharashtra, especially in the dry regions of Solapur.', mr: 'ज्वारी हे महाराष्ट्रातील प्रमुख अन्नधान्य असून विशेषतः सोलापूरच्या कोरड्या भागात घेतले जाते.' },
      chart: [
        { name: 'Solapur', value: 35.5 },
        { name: 'Ahmednagar', value: 18.2 },
        { name: 'Sangli', value: 15.5 },
        { name: 'Pune', value: 12.8 },
        { name: 'Others', value: 18.0 },
      ]
    },
    sales: {
      markets: { en: 'Solapur, Sangli, Pune, Latur', mr: 'सोलापूर, सांगली, पुणे, लातूर' },
      value: '₹3,200 Crores',
      share: '25.2%',
      description: { en: 'Solapur is the largest trading hub for Jowar in the state.', mr: 'सोलापूर हे राज्यातील ज्वारीचे सर्वात मोठे व्यापारी केंद्र आहे.' },
      chart: [
        { name: 'Solapur', value: 45.5 },
        { name: 'Sangli', value: 20.2 },
        { name: 'Pune', value: 15.5 },
        { name: 'Latur', value: 10.8 },
        { name: 'Others', value: 8.0 },
      ]
    },
    cultivation: {
      prep: [
        { en: 'Deep black soil is ideal. Two harrowings after first rain.', mr: 'खोल काळी जमीन आदर्श आहे. पहिल्या पावसानंतर दोनदा कुळवाच्या पाळ्या द्या.' },
        { en: 'Sowing during Kharif (June-July) or Rabi (Sept-Oct).', mr: 'खरीप (जून-जुलै) किंवा रब्बी (सप्टेंबर-ऑक्टोबर) हंगामात पेरणी करा.' }
      ],
      fert: [
        { en: 'Recommended NPK: 80:40:40 kg/ha for rain-fed crops.', mr: 'शिफारसीय खते: ८०:४०:४० किलो नत्र:स्फुरद:पालाश प्रति हेक्टर.' },
        { en: 'Apply half Nitrogen dose at sowing and half after 30 days.', mr: 'नत्राची अर्धी मात्रा पेरणीवेळी आणि उरलेली ३० दिवसांनी द्या.' }
      ],
      pests: [
        { en: 'Shoot Fly: Dead hearts in seedlings. Use early sowing.', mr: 'खोडमाशी: रोपावस्थेत पोंगा मरतो. लवकर पेरणी करा.' },
        { en: 'Aphids: Monitor during humid cloudy weather.', mr: 'मावा: ढगाळ आणि दमट हवामानात लक्ष ठेवा.' }
      ]
    }
  },
  {
    id: 'bajra',
    name: { en: 'Bajra (Pearl Millet)', mr: 'बाजरी' },
    imageId: 'bajra-guide',
    production: {
      districts: { en: 'Ahmednagar, Nashik, Dhule, Jalgaon, Pune', mr: 'अहमदनगर, नाशिक, धुळे, जळगाव, पुणे' },
      value: '0.8 Million Tonnes',
      share: '12.5%',
      description: { en: 'Bajra is grown in lighter soils and requires minimal water, common in North Maharashtra.', mr: 'बाजरी हलक्या जमिनीत घेतली जाते आणि तिला कमी पाणी लागते, उत्तर महाराष्ट्रात हे पीक सामान्य आहे.' },
      chart: [
        { name: 'Ahmednagar', value: 30.5 },
        { name: 'Nashik', value: 22.8 },
        { name: 'Dhule', value: 18.2 },
        { name: 'Jalgaon', value: 12.5 },
        { name: 'Others', value: 16.0 },
      ]
    },
    sales: {
      markets: { en: 'Ahmednagar, Nashik, Jalgaon, Dhule', mr: 'अहमदनगर, नाशिक, जळगाव, धुळे' },
      value: '₹1,800 Crores',
      share: '15.2%',
      description: { en: 'Regional markets in Ahmednagar and Nashik drive the trade for Bajra.', mr: 'अहमदनगर आणि नाशिकमधील प्रादेशिक बाजारपेठा बाजरीच्या व्यापाराला चालना देतात.' },
      chart: [
        { name: 'Ahmednagar', value: 40.5 },
        { name: 'Nashik', value: 25.8 },
        { name: 'Jalgaon', value: 15.2 },
        { name: 'Dhule', value: 10.5 },
        { name: 'Others', value: 8.0 },
      ]
    },
    cultivation: {
      prep: [
        { en: 'Light to medium well-drained soils. Fine tilth is necessary.', mr: 'हलकी ते मध्यम निचरा होणारी जमीन. जमीन भुसभुशीत असणे आवश्यक आहे.' },
        { en: 'Sowing depth: 2-3 cm for better germination.', mr: 'पेरणीची खोली: उत्तम उगवणीसाठी २-३ सेंमी ठेवा.' }
      ],
      fert: [
        { en: 'NPK dose: 60:30:30 kg/ha for rain-fed varieties.', mr: 'खताची मात्रा: ६०:३०:३० किलो नत्र:स्फुरद:पालाश प्रति हेक्टर.' },
        { en: 'Use Azotobacter for seed treatment to save on Nitrogen.', mr: 'नत्राची बचत करण्यासाठी अ‍ॅझोटोबॅक्टरची बीजप्रक्रिया करा.' }
      ],
      pests: [
        { en: 'Ergot: Pinkish gummy fluid from ear heads. Use salt water treatment.', mr: 'एर्गॉट (चिपका): कणसातून गुलाबी चिकट द्राव बाहेर येतो. मिठाच्या पाण्याचा वापर करा.' },
        { en: 'Downy Mildew: Whitish growth on underside of leaves.', mr: 'केवडा (डाउनी मिल्ड्यू): पानांच्या खालच्या बाजूला पांढरी वाढ दिसते.' }
      ]
    }
  },
  {
    id: 'wheat',
    name: { en: 'Wheat', mr: 'गहू' },
    imageId: 'wheat-guide',
    production: {
      districts: { en: 'Ahmednagar, Nashik, Pune, Solapur, Nagpur', mr: 'अहमदनगर, नाशिक, पुणे, सोलापूर, नागपूर' },
      value: '1.8 Million Tonnes',
      share: '1.5%',
      description: { en: 'Wheat is a major Rabi crop in Maharashtra, often grown after Soybean or Cotton.', mr: 'गहू हे महाराष्ट्रातील प्रमुख रब्बी पीक असून सोयाबीन किंवा कापसानंतर घेतले जाते.' },
      chart: [
        { name: 'Ahmednagar', value: 25.5 },
        { name: 'Nashik', value: 20.8 },
        { name: 'Pune', value: 18.2 },
        { name: 'Nagpur', value: 15.5 },
        { name: 'Others', value: 20.0 },
      ]
    },
    sales: {
      markets: { en: 'Pune, Nashik, Nagpur, Aurangabad', mr: 'पुणे, नाशिक, नागपूर, औरंगाबाद' },
      value: '₹4,500 Crores',
      share: '2.1%',
      description: { en: 'Pune and Nashik are primary demand centers for local wheat varieties.', mr: 'पुणे आणि नाशिक ही स्थानिक गव्हाच्या जातींसाठी प्रमुख मागणी केंद्रे आहेत.' },
      chart: [
        { name: 'Pune', value: 35.5 },
        { name: 'Nashik', value: 25.8 },
        { name: 'Nagpur', value: 15.2 },
        { name: 'Aurangabad', value: 13.5 },
        { name: 'Others', value: 10.0 },
      ]
    },
    cultivation: {
      prep: [
        { en: 'Medium to heavy black soil. Prepare field with fine tilth.', mr: 'मध्यम ते भारी काळी जमीन. जमीन भुसभुशीत करून वाफे तयार करा.' },
        { en: 'Ideal sowing time: Nov 1st to 15th for maximum yield.', mr: 'पेरणीची योग्य वेळ: जास्तीत जास्त उत्पादनासाठी १ ते १५ नोव्हेंबर.' }
      ],
      fert: [
        { en: 'Standard NPK: 120:60:40 kg/ha for irrigated wheat.', mr: 'प्रमाणित खते: बागायती गव्हासाठी १२०:६०:४० किलो नत्र:स्फुरद:पालाश.' },
        { en: 'Apply Phosphorus and Potash as basal dose.', mr: 'स्फुरद आणि पालाशची संपूर्ण मात्रा पेरणीवेळी द्या.' }
      ],
      pests: [
        { en: 'Rust: Orange/black spots on leaves. Use resistant varieties.', mr: 'तांबेरा: पानांवर नारंगी किंवा काळे ठिपके. रोगप्रतिकारक जाती निवडा.' },
        { en: 'Termites: Problem in dry sandy soils. Maintain soil moisture.', mr: 'वाळवी: कोरड्या वालुकामय जमिनीत समस्या येते. जमिनीत ओलावा राखा.' }
      ]
    }
  },
  {
    id: 'gram',
    name: { en: 'Gram (Chickpea)', mr: 'हरभरा' },
    imageId: 'gram-guide',
    production: {
      districts: { en: 'Ahmednagar, Pune, Solapur, Nashik, Latur', mr: 'अहमदनगर, पुणे, सोलापूर, नाशिक, लातूर' },
      value: '2.2 Million Tonnes',
      share: '18.2%',
      description: { en: 'Maharashtra is a significant producer of Gram, especially the "Desi" varieties.', mr: 'महाराष्ट्र हा हरभऱ्याचा एक महत्त्वाचा उत्पादक असून प्रामुख्याने "देशी" जाती घेतल्या जातात.' },
      chart: [
        { name: 'Ahmednagar', value: 24.5 },
        { name: 'Latur', value: 20.8 },
        { name: 'Solapur', value: 18.2 },
        { name: 'Pune', value: 12.5 },
        { name: 'Others', value: 24.0 },
      ]
    },
    sales: {
      markets: { en: 'Latur, Pune, Solapur, Akola', mr: 'लातूर, पुणे, सोलापूर, अकोला' },
      value: '₹6,800 Crores',
      share: '20.1%',
      description: { en: 'Latur market is a major hub for trading Gram and other pulses.', mr: 'लातूर ही हरभरा आणि इतर कडधान्यांच्या व्यापारासाठी मोठी बाजारपेठ आहे.' },
      chart: [
        { name: 'Latur', value: 40.5 },
        { name: 'Pune', value: 20.8 },
        { name: 'Solapur', value: 15.2 },
        { name: 'Akola', value: 13.5 },
        { name: 'Others', value: 10.0 },
      ]
    },
    cultivation: {
      prep: [
        { en: 'Medium to heavy black soil with good moisture retention.', mr: 'ओलावा टिकवून धरणारी मध्यम ते भारी काळी जमीन.' },
        { en: 'Seed treatment: Rhizobium + PSB + Trichoderma.', mr: 'बीजप्रक्रिया: रायझोबियम + पीएसबी + ट्रायकोडर्मा.' }
      ],
      fert: [
        { en: 'NPK dose: 20:40:0 kg/ha as basal application.', mr: 'खताची मात्रा: २०:४०:० किलो नत्र:स्फुरद:पालाश पायाभूत म्हणून द्या.' },
        { en: 'Phosphorus application ensures better root nodules.', mr: 'स्फुरदमुळे मुळांवरील गाठींची वाढ उत्तम होते.' }
      ],
      pests: [
        { en: 'Pod Borer: Major pest. Use "T" shaped perches for birds.', mr: 'शेंग पोखरणारी अळी: मुख्य कीड. पक्षी थांबण्यासाठी "T" आकाराचे खुंटे लावा.' },
        { en: 'Fusarium Wilt: Use resistant varieties like Phule Vikram.', mr: 'मर रोग: फुले विक्रम सारख्या रोगप्रतिकारक जाती वापरा.' }
      ]
    }
  },
  {
    id: 'banana',
    name: { en: 'Banana', mr: 'केळी' },
    imageId: 'banana-guide',
    production: {
      districts: { en: 'Jalgaon, Kolhapur, Solapur, Pune, Nanded', mr: 'जळगाव, कोल्हापूर, सोलापूर, पुणे, नांदेड' },
      value: '4.5 Million Tonnes',
      share: '15.5%',
      description: { en: 'Jalgaon is known as the Banana City of Maharashtra, contributing to massive exports.', mr: 'जळगाव हे महाराष्ट्राचे "केळीचे शहर" म्हणून ओळखले जाते, जेथून मोठी निर्यात होते.' },
      chart: [
        { name: 'Jalgaon', value: 65.5 },
        { name: 'Kolhapur', value: 12.8 },
        { name: 'Solapur', value: 8.2 },
        { name: 'Nanded', value: 5.5 },
        { name: 'Others', value: 8.0 },
      ]
    },
    sales: {
      markets: { en: 'Jalgaon (Major Hub), Mumbai, Pune, Exports', mr: 'जळगाव (प्रमुख केंद्र), मुंबई, पुणे, निर्यात' },
      value: '₹12,500 Crores',
      share: '18.2%',
      description: { en: 'High-quality Grand Naine bananas from Jalgaon are sold across India and Gulf countries.', mr: 'जळगावमधील ग्रँड नैन जातीच्या उच्च दर्जाच्या केळींची भारतभर आणि आखाती देशांत विक्री होते.' },
      chart: [
        { name: 'Jalgaon', value: 70.5 },
        { name: 'Mumbai', value: 12.8 },
        { name: 'Pune', value: 8.2 },
        { name: 'Exports', value: 5.5 },
        { name: 'Others', value: 3.0 },
      ]
    },
    cultivation: {
      prep: [
        { en: 'Deep fertile soil with good drainage. Spacing: 1.5m x 1.5m.', mr: 'चांगला निचरा होणारी खोल सुपीक जमीन. लागवडीचे अंतर: १.५ मी x १.५ मी.' },
        { en: 'Drip irrigation is mandatory for efficient water and nutrient use.', mr: 'पाणी आणि खतांच्या कार्यक्षम वापरासाठी ठिबक सिंचन अनिवार्य आहे.' }
      ],
      fert: [
        { en: 'NPK per plant: 200:40:200 g. Use fertigation for better results.', mr: 'प्रति झाड खते: २००:४०:२०० ग्रॅम नत्र:स्फुरद:पालाश. फर्टिगेशनचा वापर करा.' },
        { en: 'Micronutrients (Zinc, Boron) improve fruit quality and weight.', mr: 'सूक्ष्मद्रव्ये (जस्त, बोरॉन) केळीची गुणवत्ता आणि वजन सुधारतात.' }
      ],
      pests: [
        { en: 'Sigatoka Leaf Spot: Premature leaf drying. Maintain sanitation.', mr: 'सिगाटोका करपा: पाने अकाली सुकतात. बागेत स्वच्छता ठेवा.' },
        { en: 'Banana Weevil: Borer attacking the rhizome. Use trap plants.', mr: 'केळीवरील सोंडकिडा: कंदावर हल्ला करतो. सापळा पिकांचा वापर करा.' }
      ]
    }
  }
];

export default function CropGuidePage() {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [dataType, setDataType] = useState<'production' | 'sales' | 'tips'>('production');
  const [mounted, setMounted] = useState(false);
  const t = translations[language];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  const filteredCrops = cropData.filter(crop => 
    crop.name.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crop.name.mr.includes(searchTerm)
  );

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-20 animate-in fade-in duration-1000 bg-background/50">
      <div className="mb-16 text-center max-w-4xl mx-auto">
        <div className="mx-auto bg-primary/10 p-5 rounded-3xl w-fit mb-6 animate-in zoom-in duration-700 shadow-soft">
          <Info className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold font-headline mb-6 animate-in slide-in-from-top-4 duration-700 tracking-tight text-foreground">
          {t.title}
        </h1>
        <p className="mt-2 text-muted-foreground text-lg md:text-2xl leading-relaxed animate-in fade-in duration-1000 delay-300">
          {t.description}
        </p>
      </div>

      <div className="max-w-5xl mx-auto mb-16 flex flex-col md:flex-row gap-6 items-center sticky top-[6.5rem] z-20 bg-background/80 backdrop-blur-xl py-6 px-6 rounded-[2rem] border border-border shadow-soft-xl transition-all">
        <div className="relative flex-grow w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-6 w-6" />
          <Input 
            className="pl-12 h-14 text-lg rounded-2xl shadow-sm border-2 border-transparent focus:border-primary/30 focus:ring-4 ring-primary/5 transition-all bg-muted/30"
            placeholder={t.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue="production" className="w-full md:w-auto shrink-0" onValueChange={(val) => setDataType(val as any)}>
          <TabsList className="grid w-full grid-cols-3 h-14 p-1.5 bg-muted/50 rounded-2xl">
            <TabsTrigger value="production" className="text-sm md:text-base font-bold rounded-xl data-[state=active]:bg-card data-[state=active]:shadow-soft">
              <TrendingUp className="mr-2 h-4 w-4 hidden sm:inline" />
              {t.production}
            </TabsTrigger>
            <TabsTrigger value="sales" className="text-sm md:text-base font-bold rounded-xl data-[state=active]:bg-card data-[state=active]:shadow-soft">
              <ShoppingBag className="mr-2 h-4 w-4 hidden sm:inline" />
              {t.sales}
            </TabsTrigger>
            <TabsTrigger value="tips" className="text-sm md:text-base font-bold rounded-xl data-[state=active]:bg-card data-[state=active]:shadow-soft">
              <Lightbulb className="mr-2 h-4 w-4 hidden sm:inline" />
              {t.tips}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-12 lg:grid-cols-1 max-w-6xl mx-auto">
        {filteredCrops.length > 0 ? (
          filteredCrops.map((crop, idx) => {
            const data = dataType === 'sales' ? crop.sales : crop.production;
            const chartData = data.chart;
            const chartTitle = dataType === 'production' ? t.chartTitleProduction : t.chartTitleSales;
            const locationLabel = dataType === 'production' ? t.majorDistricts : t.majorMarkets;
            const locations = dataType === 'production' ? crop.production.districts : crop.sales.markets;
            const statsLabel = dataType === 'production' ? t.stateProduction : t.stateSalesValue;
            
            const cropImage = PlaceHolderImages.find(p => p.id === crop.imageId);

            return (
              <Card 
                key={crop.id} 
                className="overflow-hidden border-none shadow-soft transition-all duration-700 hover:shadow-soft-xl animate-in fade-in slide-in-from-bottom-12 rounded-[2.5rem] bg-card/50 backdrop-blur-sm"
                style={{ transitionDelay: `${idx * 50}ms` }}
              >
                <div className="grid md:grid-cols-2 lg:grid-cols-5 h-full">
                  <div className="p-8 md:p-12 lg:col-span-3 flex flex-col justify-between border-b md:border-b-0 md:border-r border-border/50">
                    <div className="animate-in fade-in slide-in-from-left-4 duration-700">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="bg-primary/10 p-3 rounded-2xl shadow-sm transition-transform hover:rotate-6">
                          <Wheat className="h-8 w-8 text-primary" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold font-headline text-foreground">{crop.name[language]}</h2>
                        <Badge variant="outline" className="ml-auto border-primary/20 text-primary font-bold px-4 py-1.5 rounded-full bg-primary/5">
                          {dataType === 'production' ? t.production : dataType === 'sales' ? t.sales : t.tips}
                        </Badge>
                      </div>
                      
                      <div className="mt-0 animate-in fade-in slide-in-from-right-4 duration-700">
                        {dataType !== 'tips' ? (
                          <>
                            <div className="relative aspect-[16/9] mb-8 rounded-[2rem] overflow-hidden border border-white/20 group shadow-soft">
                              {cropImage && (
                                <Image 
                                  src={cropImage.imageUrl} 
                                  alt={cropImage.description} 
                                  fill 
                                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                  data-ai-hint={cropImage.imageHint}
                                />
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            
                            <p className="text-muted-foreground text-lg mb-10 leading-relaxed font-medium">
                              {data.description[language]}
                            </p>
                            
                            <div className="space-y-8">
                              <div className="flex items-start gap-5 group">
                                <div className="bg-primary/5 p-3 rounded-2xl text-primary transition-transform group-hover:translate-y-[-4px]">
                                  <MapPin className="h-6 w-6 shrink-0" />
                                </div>
                                <div>
                                  <p className="font-bold text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">{locationLabel}</p>
                                  <p className="text-xl font-bold text-foreground">{locations[language]}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-start gap-5 group">
                                <div className="bg-primary/5 p-3 rounded-2xl text-primary transition-transform group-hover:scale-110">
                                  <TrendingUp className="h-6 w-6 shrink-0" />
                                </div>
                                <div>
                                  <p className="font-bold text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">{t.stats}</p>
                                  <div className="flex flex-wrap gap-3">
                                    <Badge className="px-5 py-2.5 rounded-2xl bg-primary text-primary-foreground font-bold shadow-soft">
                                      {statsLabel}: {data.value}
                                    </Badge>
                                    <Badge variant="outline" className="px-5 py-2.5 rounded-2xl border-primary/20 text-primary font-bold bg-primary/5">
                                      {t.nationalShare}: {data.share}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="space-y-10">
                            <div className="relative aspect-[21/9] mb-2 rounded-[2rem] overflow-hidden border border-border/50 group shadow-soft">
                              {cropImage && (
                                <Image 
                                  src={cropImage.imageUrl} 
                                  alt={cropImage.description} 
                                  fill 
                                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                  data-ai-hint={cropImage.imageHint}
                                />
                              )}
                            </div>
                            
                            <div className="grid gap-10">
                              <div className="space-y-5">
                                <div className="flex items-center gap-3 text-primary font-black text-lg">
                                  <div className="bg-primary/10 p-2 rounded-xl"><Sprout className="h-6 w-6" /></div>
                                  <h3>{t.prepTitle}</h3>
                                </div>
                                <ul className="grid gap-3">
                                  {crop.cultivation.prep.map((step, idx) => (
                                    <li key={idx} className="flex items-start gap-4 bg-muted/20 p-4 rounded-2xl border border-white transition-all hover:translate-x-2 hover:bg-card">
                                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                                      <p className="text-base font-medium">{step[language]}</p>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div className="space-y-5">
                                <div className="flex items-center gap-3 text-primary font-black text-lg">
                                  <div className="bg-primary/10 p-2 rounded-xl"><FlaskConical className="h-6 w-6" /></div>
                                  <h3>{t.fertTitle}</h3>
                                </div>
                                <ul className="grid gap-3">
                                  {crop.cultivation.fert.map((step, idx) => (
                                    <li key={idx} className="flex items-start gap-4 bg-muted/20 p-4 rounded-2xl border border-white transition-all hover:translate-x-2 hover:bg-card">
                                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                                      <p className="text-base font-medium">{step[language]}</p>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div className="space-y-5">
                                <div className="flex items-center gap-3 text-destructive font-black text-lg">
                                  <div className="bg-destructive/10 p-2 rounded-xl"><Bug className="h-6 w-6" /></div>
                                  <h3>{t.pestTitle}</h3>
                                </div>
                                <ul className="grid gap-3">
                                  {crop.cultivation.pests.map((step, idx) => (
                                    <li key={idx} className="flex items-start gap-4 bg-red-50/50 dark:bg-red-900/10 p-4 rounded-2xl border border-red-100 transition-all hover:translate-x-2 hover:bg-red-100/30">
                                      <CheckCircle2 className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
                                      <p className="text-base font-medium">{step[language]}</p>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-8 md:p-12 lg:col-span-2 bg-muted/30 flex flex-col justify-center min-h-[450px]">
                    {dataType !== 'tips' ? (
                      <div className="animate-in fade-in slide-in-from-right-8 duration-1000 flex flex-col items-center h-full">
                        <h3 className="text-xl font-black mb-10 text-foreground text-center bg-card/80 px-6 py-2 rounded-full shadow-soft">{chartTitle}</h3>
                        <div className="h-[380px] w-full transition-all hover:scale-105 duration-700">
                          <PieChartComponent data={chartData} colors={COLORS} type={dataType} />
                        </div>
                      </div>
                    ) : (
                      <div className="text-center space-y-8 animate-in zoom-in duration-1000 p-6">
                        <div className="bg-card rounded-[3rem] p-12 shadow-soft-xl border-4 border-dashed border-primary/10 transition-all hover:border-primary/30">
                          <div className="bg-primary/5 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce duration-[3000ms]">
                            <Sprout className="h-12 w-12 text-primary/60" />
                          </div>
                          <h3 className="text-2xl font-black font-headline text-primary mb-4 leading-tight">{crop.name[language]} {t.farmingGuide}</h3>
                          <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                            {language === 'en' 
                              ? 'Success begins with certified seeds and precision soil analysis. Follow our protocols for peak efficiency.' 
                              : 'यशस्वी शेतीची सुरुवात प्रमाणित बियाणे आणि अचूक माती परीक्षणाने होते. जास्तीत जास्त कार्यक्षमतेसाठी आमच्या पद्धतींचे अनुसरण करा.'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        ) : (
          <div className="text-center py-32 bg-muted/20 rounded-[3rem] border-4 border-dashed border-muted transition-all animate-in fade-in duration-700">
            <Search className="h-20 w-20 text-muted-foreground/30 mx-auto mb-6" />
            <p className="text-2xl text-muted-foreground font-bold">{t.noCropsFound}</p>
          </div>
        )}
      </div>
    </div>
  );
}
