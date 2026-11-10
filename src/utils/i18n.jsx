import { createContext, useContext, useEffect, useState } from "react";
import { translations } from "../data/translations";
import { getLang, saveLang } from "./settings";

const LangContext = createContext(null);

export function LangProvider({ children }) {
    const [lang, setLangState] = useState(getLang());

    useEffect(() => {
        document.documentElement.lang = lang || "en";
        document.documentElement.dir = lang === "ur" ? "rtl" : "ltr";
    }, [lang]);

    function setLang(l) {
        setLangState(l);
        saveLang(l);
    }

    // t("key") ya t("key", { n: 2 }). Text na mile to English.
    function t(key, vars) {
        const table = translations[lang] || translations.en;
        let text = table[key] || translations.en[key] || key;
        if (vars) {
            Object.keys(vars).forEach((k) => {
                text = text.replace(`{${k}}`, vars[k]);
            });
        }
        return text;
    }

    return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export function useLang() {
    return useContext(LangContext);
}