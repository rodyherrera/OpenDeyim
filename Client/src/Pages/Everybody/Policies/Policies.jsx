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

import React from 'react';
import Fade from '../../../Components/General/Fade';
import UseWindowSize from '../../../Hooks/WindowSize';
import { IconButton } from '@mui/material';
import { VscGithubAlt } from 'react-icons/vsc';
import { TfiBook } from 'react-icons/tfi';
import { TbEngine, TbLicense } from 'react-icons/tb';
import { HiOutlineSpeakerWave } from 'react-icons/hi2';
import { MdOutlineTranslate } from 'react-icons/md';
import './Policies.css';

const PoliciesPage = () => {
    const [Width] = UseWindowSize();
    const ExternalReferences = [
        // ! [TITLE, LINK, ICON]
        ['Docs', 'https://github.com/CodeWithRodi/OpenDeyim', <VscGithubAlt />],
        ['License', 'https://github.com/CodeWithRodi/OpenDeyim', <TbLicense />],
        ['CodexDrake', 'https://github.com/CodeWithRodi/CodexDrake', <TfiBook />],
        ['ArgosTranslate', 'https://github.com/argosopentech/argos-translate', <TbEngine />],
        ['LibreTranslate', 'https://github.com/LibreTranslate/LibreTranslate', <MdOutlineTranslate />],
        ['React Speech', 'https://www.npmjs.com/package/react-speech-kit', <HiOutlineSpeakerWave />]
    ];
    const Policies = [
        // ! [TITLE, CONTENT]
        ['How is your data used within the platform?', 'At the moment in which we manipulate your data, we do so with the sole purpose of enriching your experience within this platform. Consider that absolutely at no time do we use your data for malicious purposes, we do not share your data with our servers or external, these are only stored within your local storage that your browser owns. Keep in mind that all your activity within the platform is completely anonymous, only you have access to your data, which is stored locally, you can technically delete it when you see fit.'],
        ['Features tailored to your experience', 'When using our translation service, not only do you have the possibility of being able to clearly carry out a simple and boring translation, but you can press play and analyze your pronunciation, speak by voice and be able to translate from the captured data, Search for websites and images related to a certain translation through the CodexDrake search engine. You also have a history of translations carried out satisfactorily, and, as previously mentioned in the section where we talk about your data and privacy, this translation history is stored in your local storage that you provide us with. your browser, in case it is activated of course, at no time do we store your data within any specific server.'],
        ['Open Source', '"OpenDeyim - Modern Open Source Translation Software" is an open source platform with the purpose of serving as inspiration, a source of creativity and promoting the development of technologies and platforms. This software is under the MIT license, allowing collaboration/contribution between an eventual community, just as it allows third parties to use the OpenDeyim source code for their own benefit, you can learn from it and create your own tools. Consider that OpenDeyim has pieces within the backend which is written in Python of the LibreTranslate platform, the difference is that OpenDeyim removes a considerable amount of functionality from the original backend, providing only a Public API which is consumed from the React application. Although this software was rewritten from scratch, it is necessary to give the respective credits to LibreTranslate and its respective contributors.']
    ];

    return (
        <main id='Policies-Main'>
            <section id='Heading-Box'>
                <Fade top>
                    <h2>Terms and policy of use, data manipulation and software distributions</h2>
                </Fade>
                <Fade bottom>
                    <p>Some terms and policies that you are automatically accepting when you enter and use our platform, as well as the distribution of the source code with or without profit.</p>
                </Fade>
            </section>

            {Policies.map(([ Title, Content ], Index) => (
                <Fade key={Index} {...(Width > 768) && ({ right: (Index % 2 !== 0), left: (Index % 2 === 0) })} bottom>
                    <section className='Policies-Box'>
                        <h3>{Title}</h3>
                        <p>{Content}</p>
                    </section>
                </Fade>
            ))}

            <section id='External-Reference-Box'>
                {ExternalReferences.map(([ Title, Link, Icon ], Index) => (
                    <Fade key={Index} bottom>
                        <article onClick={() => window.open(Link, '_blank')}>
                            <IconButton>
                                {Icon}
                            </IconButton>
                            <span>{Title}</span>
                        </article>
                    </Fade>
                ))}
            </section>
        </main>
    );
};

export default PoliciesPage;