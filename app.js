require('dotenv').config()

const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();


// Secret keys
const API_KEY = process.env.API_KEY;
const API_HOST = process.env.API_HOST;


var languageNames = [];
const languageMap = {
    "af": "Afrikaans",
    "ak": "Akan",
    "am": "Amharic",
    "ar": "Arabic",
    "as": "Assamese",
    "ay": "Aymara",
    "az": "Azerbaijani",
    "be": "Belarusian",
    "bg": "Bulgarian",
    "bho": "Bhojpuri",
    "bm": "Bambara",
    "bn": "Bengali",
    "bs": "Bosnian",
    "ca": "Catalan",
    "ceb": "Cebuano",
    "ckb": "Central Kurdish",
    "co": "Corsican",
    "cs": "Czech",
    "cy": "Welsh",
    "da": "Danish",
    "de": "German",
    "doi": "Dogri",
    "dv": "Divehi",
    "ee": "Ewe",
    "el": "Greek",
    "en": "English",
    "eo": "Esperanto",
    "es": "Spanish",
    "et": "Estonian",
    "eu": "Basque",
    "fa": "Persian",
    "fi": "Finnish",
    "fr": "French",
    "fy": "Western Frisian",
    "ga": "Irish",
    "gd": "Scottish Gaelic",
    "gl": "Galician",
    "gn": "Guarani",
    "gom": "Goan Konkani",
    "gu": "Gujarati",
    "ha": "Hausa",
    "haw": "Hawaiian",
    "he": "Hebrew",
    "hi": "Hindi",
    "hmn": "Hmong",
    "hr": "Croatian",
    "ht": "Haitian Creole",
    "hu": "Hungarian",
    "hy": "Armenian",
    "id": "Indonesian",
    "ig": "Igbo",
    "ilo": "Ilocano",
    "is": "Icelandic",
    "it": "Italian",
    "iw": "Hebrew",
    "ja": "Japanese",
    "jv": "Javanese",
    "jw": "Javanese",
    "ka": "Georgian",
    "kk": "Kazakh",
    "km": "Khmer",
    "kn": "Kannada",
    "ko": "Korean",
    "kri": "Krio",
    "ku": "Kurdish",
    "ky": "Kyrgyz",
    "la": "Latin",
    "lb": "Luxembourgish",
    "lg": "Ganda",
    "ln": "Lingala",
    "lo": "Lao",
    "lt": "Lithuanian",
    "lus": "Mizo",
    "lv": "Latvian",
    "mai": "Maithili",
    "mg": "Malagasy",
    "mi": "Maori",
    "mk": "Macedonian",
    "ml": "Malayalam",
    "mn": "Mongolian",
    "mni-Mtei": "Manipuri (Meitei Mayek)",
    "mr": "Marathi",
    "ms": "Malay",
    "mt": "Maltese",
    "my": "Burmese",
    "ne": "Nepali",
    "nl": "Dutch",
    "no": "Norwegian",
    "nso": "Northern Sotho",
    "ny": "Nyanja",
    "om": "Oromo",
    "or": "Odia",
    "pa": "Punjabi",
    "pl": "Polish",
    "ps": "Pashto",
    "pt": "Portuguese",
    "qu": "Quechua",
    "ro": "Romanian",
    "ru": "Russian",
    "rw": "Kinyarwanda",
    "sa": "Sanskrit",
    "sd": "Sindhi",
    "si": "Sinhala",
    "sk": "Slovak",
    "sl": "Slovenian",
    "sm": "Samoan",
    "sn": "Shona",
    "so": "Somali",
    "sq": "Albanian",
    "sr": "Serbian",
    "st": "Southern Sotho",
    "su": "Sundanese",
    "sv": "Swedish",
    "sw": "Swahili",
    "ta": "Tamil",
    "te": "Telugu",
    "tg": "Tajik",
    "th": "Thai",
    "ti": "Tigrinya",
    "tk": "Turkmen",
    "tl": "Tagalog",
    "tr": "Turkish",
    "ts": "Tsonga",
    "tt": "Tatar",
    "ug": "Uyghur",
    "uk": "Ukrainian",
    "ur": "Urdu",
    "uz": "Uzbek",
    "vi": "Vietnamese",
    "xh": "Xhosa",
    "yi": "Yiddish",
    "yo": "Yoruba",
    "zh": "Chinese",
    "zh-CN": "Chinese (Simplified)",
    "zh-TW": "Chinese (Traditional)",
    "zu": "Zulu"
};



app.use(bodyParser.urlencoded({
    extended: true
}));
app.set('view engine', 'ejs');
app.use(express.static('public'));






app.get('/', async (req, res) => {
    try {
        // Lấy tất cả mã ngôn ngữ
        const languageOptions = {
            method: 'GET',
            url: 'https://google-translate1.p.rapidapi.com/language/translate/v2/languages',
            headers: {
                'Accept-Encoding': 'application/gzip',
                'X-RapidAPI-Key': API_KEY,
                'X-RapidAPI-Host': API_HOST,
            }
        };
        const languageResponse = await axios.request(languageOptions);
        const languages = languageResponse.data.data.languages;
        languages.forEach(lang => {
            languageNames.push(lang.language);
        });
        console.log(languageNames);
        res.render('index', {
            languageNames,
            languageMap,
        });
    } catch (error) {
        console.error(error);
        res.send('An error occurred.');
    }
});






app.post('/translate', async (req, res) => {
    const {
        text,
        targetLanguage
    } = req.body;
    try {
        // Lấy tất cả mã ngôn ngữ
        const languageOptions = {
            method: 'GET',
            url: 'https://google-translate1.p.rapidapi.com/language/translate/v2/languages',
            headers: {
                'Accept-Encoding': 'application/gzip',
                'X-RapidAPI-Key': API_KEY,
                'X-RapidAPI-Host': API_HOST,
            }
        };
        const languageResponse = await axios.request(languageOptions);
        const languages = languageResponse.data.data.languages;
        languages.forEach(lang => {
            languageNames.push(lang.language);
        });


        // Phát hiện ngôn ngữ
        const detectParams = new URLSearchParams();
        detectParams.append('q', text);

        const detectOptions = {
            method: 'POST',
            url: 'https://google-translate1.p.rapidapi.com/language/translate/v2/detect',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'X-RapidAPI-Key': API_KEY,
                'X-RapidAPI-Host': API_HOST,
            },
            data: detectParams,
        };

        const detectResponse = await axios.request(detectOptions);
        const detectedLanguage = detectResponse.data.data.detections[0][0].language;

        // Dịch văn bản 
        const translatedLanguage = targetLanguage;

        const translateParams = new URLSearchParams();
        translateParams.append('q', text);
        translateParams.append('source', detectedLanguage);
        translateParams.append('target', targetLanguage);

        const translateOptions = {
            method: 'POST',
            url: 'https://google-translate1.p.rapidapi.com/language/translate/v2',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'X-RapidAPI-Key': API_KEY,
                'X-RapidAPI-Host': API_HOST,
            },
            data: translateParams,
        };

        const translateResponse = await axios.request(translateOptions);
        const translatedText = translateResponse.data.data.translations[0].translatedText;

        // Render
        res.render('index', {
            originalText: text,
            detectedLanguage,
            translatedText,
            translatedLanguage,
            languageNames,
            languageMap,
        });
        console.log(text);
        console.log(detectedLanguage);
        console.log(translatedText);

    } catch (error) {
        console.error(error);
        res.send('An error occurred.');
    }
});





const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});