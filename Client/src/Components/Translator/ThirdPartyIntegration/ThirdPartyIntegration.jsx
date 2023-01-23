/***
 * Copyright (C) Rodolfo Herrera Hernandez. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project root
 * for full license information.
 *
 * =+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
 *
 * The OpenDeyim Source Code
 * A free, modern, self-hosted and open source translation service that instantly 
 * translates phrases, words and web pages into more than 30 languages. Use our 
 * API or bindings and experiment with OpenDeyim.
 * 
 * For more information, please read the documentation inside 
 * the <README.md> file which is located at the root of this directory or source code.
 * 
 * (www.github.com/codewithrodi/OpenDeyim/)
 * 
 * Rodolfo Herrera Hernandez <contact@codewithrodi.com>.
 * Full Stack Software Developer.
 *
 * =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
 ****/

import React, { useContext, useEffect, useState } from 'react';
import Infrastructure from '../../../Infrastructure.json';
import BlueBlog from '../../../Assets/Images/ThirdPartyIntegration/Blue-Blob.png';
import Fade from '../../../Components/General/Fade';
import UseWindowSize from '../../../Hooks/WindowSize';
import IsHTML from 'is-html';
import { CopyBlock } from 'react-code-blocks';
import { useAlert } from 'react-alert';
import { TranslatorContext } from '../../../Services/Translator/Context';
import './ThirdPartyIntegration.css';

// TODO: Is it the best way to do this? 
// TODO: Does it need a rewrite or refactoring? 
// TODO: Is it efficient?
const CODE_TEMPLATES = {
    REQUEST: `\
(async function(){
    try{
        const Response = (await (await fetch("${Infrastructure.Server}/translate", {
            method: "POST",
            body: JSON.stringify({
                Query: "QUERY",
                Source: "SOURCE",
                Target: "TARGET",
                Format: "text" // "text" or "html"
            }),
            headers: { "Content-Type": "application/json" }
        })).json());
        console.log("HTTPRequest [OK] ->", Response);
    }catch(HTTPRequestError){
        console.error("HTTPRequest [FAILED] ->", HTTPRequestError);
    }
})();`,
    RESPONSE: `\
{
    "Status": "Success",
    "Data": {
        "TranslatedText": "TRANSLATED_TEXT"DETECTED_LANGUAGE
    }
}`
};

const ThirdPartyIntegration = () => {
    const Alert = useAlert();
    const [Width] = UseWindowSize();
    const { GetServerExchangeBuffer } = useContext(TranslatorContext);
    const [GetAPIRequestTemplate, SetAPIRequestTemplate] = useState('');
    const [GetAPIResponseTemplate, SetAPIResponseTemplate] = useState('');
    const CodeBlocks = [
        // ! [TEXT, LANGUAGE, TITLE, CONTENT]
        [GetAPIRequestTemplate, 'javascript', 'Contributions and updates', 'OpenDeyim is under the MIT license, it is open to all kinds of contributions and future updates. Please note that this software is not up to date with the updates that LibreTranslate has and is not intended to do so.'],
        [GetAPIResponseTemplate, 'json', 'Regarding the software, you should consider that', 'OpenDeyim, is an open source self-hosted translator, which uses snippets of the LibreTranslate source code within its backend written in Python. Through rewrites of the source code, this has been drastically reduced, to leave just a server-side API to be consumed from the separate interface written in ReactJS. You should also consider that self hosting this software uses resources, a server with 1/2 GB of ram may not be enough.']
    ];

    useEffect(() => {
        return () => {
            SetAPIResponseTemplate('');
            SetAPIRequestTemplate('');
        };
    }, []);

    useEffect(() => {
        let { 
            Query, 
            Source, 
            Target, 
            TranslatedText, 
            DetectedLanguage } = GetServerExchangeBuffer;
        if((!Object.keys(GetServerExchangeBuffer).length) || IsHTML(Query) || Query.length > 500){
            Query = 'Hola mundo mediante una petición HTTP';
            Source = 'es';
            Target = 'en';
            TranslatedText = 'Hello world by request HTTP';
        }
        SetAPIRequestTemplate(CODE_TEMPLATES.REQUEST
            .replace('QUERY', Query)
            .replace('SOURCE', Source)
            .replace('TARGET', Target));
        SetAPIResponseTemplate(CODE_TEMPLATES.RESPONSE
            .replace('TRANSLATED_TEXT', TranslatedText)
            .replace('DETECTED_LANGUAGE', (DetectedLanguage?.Language) 
                    ? (`
        "DetectedLanguage": {
            "Confidence": "${DetectedLanguage.Confidence}",
            "Language": "${DetectedLanguage.Language}"
        }`) : ('')));
    }, [GetServerExchangeBuffer]);

    return (
        <section id='Third-Party-Integration-Box'>
            <aside className='Desktop-Box' id='Blue-Blob-Box'>
                <img src={BlueBlog} alt='Decoration Blob' />
            </aside>

            <article id='Heading-Box'>
                <Fade bottom left>
                    <h2 className='Cursor-Hover-Effect'>Touching the Public API of the software</h2>
                    <p>OpenDeyim has two environments, where the first corresponds to the frontend written in ReactJS and the second to the backend written in Python under Flask, where, through the backend, a public API is provided to connect from any given frontend.</p>
                </Fade>
            </article>

            <article id='Code-Blocks'>
                {(CodeBlocks.map(([ Text, Language, Title, Content ], Index) => (
                    <Fade  key={Index} {...(Width > 768) && ({ right: (Index % 2 !== 0), left: (Index % 2 === 0) })} bottom>
                        <div>
                            <CopyBlock
                                text={Text}
                                language={Language}
                                onCopy={Alert.success}
                                theme='a11y-light' />
                            <div>
                                <h3 className='Cursor-Hover-Effect'>{Title}</h3>
                                <p>{Content}</p>
                            </div>
                        </div>
                    </Fade>
                )))}
            </article>
        </section>
    );
};

export default ThirdPartyIntegration;
