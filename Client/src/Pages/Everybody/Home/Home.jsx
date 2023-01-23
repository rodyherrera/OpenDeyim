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
import Translator from '../../../Components/Translator';
import TranslationConcept from '../../../Assets/Images/Home/Translation-Concept.png';
import LightBlueBlobBox from '../../../Assets/Images/Home/Light-Blue-Blob-Box.png';
import Fade from '../../../Components/General/Fade';
import UseWindowSize from '../../../Hooks/WindowSize';
import { IoLanguageOutline } from 'react-icons/io5';
import { MdRestore } from 'react-icons/md';
import './Home.css';

const HomePage = () => {
    const [Width] = UseWindowSize();
    const Features = [
        // ! [TITLE, ICON, CONTENT]
        ['Connect with the outside', <IoLanguageOutline />, 'We integrate voice detection and listing, with a catalog of 30 available languages, explore all the features we offer to enrich your experience within the platform.'],
        ['Together with your process', <MdRestore />, 'We use persistence to save the history of your translations, access them as many times as you want and whenever you want.']
    ];

    return (
        <main id='Home-Main'>
            <aside id='Light-Blue-Blob-Box'>
                <img src={LightBlueBlobBox} alt='Decoration Blob' />
            </aside>
            <section id='Presentation-Box'>
                <article id='Heading-Box'>
                    <div>
                        <div>
                            <Fade top>
                                <h1 className='Cursor-Hover-Effect'>This is for the art of sharing cross-cultural knowledge.</h1>
                            </Fade>
                            <Fade bottom>
                                <p>Respecting and reserving an eternal love for the beauty and detail of things. This is your modern and elegant open source translator, welcome to OpenDeyim.</p>
                            </Fade>
                        </div>

                        <div>
                            {Features.map(([ Title, Icon, Content ], Index) => (
                                <Fade key={Index} {...(Width > 768) && ({ right: (Index % 2 !== 0), left: (Index % 2 === 0) })} bottom>
                                    <div className='Feature-Box'>
                                        <div>
                                            <i>
                                                {Icon}
                                            </i>
                                            <h3 className='Cursor-Hover-Effect'>{Title}</h3>
                                        </div>
                                        <p>{Content}</p>
                                    </div>
                                </Fade>
                            ))}
                        </div>
                    </div>
                </article>

                <article id='Complement-Box'>
                    <Fade top>
                        <img 
                            className='Cursor-Hover-Effect' 
                            src={TranslationConcept} 
                            alt='Ilustración decorativa de traducción' />
                    </Fade>
                </article>
            </section>
            
            <Translator.Form />
            <Translator.HistoryViewer />
            <Translator.ThirdPartyIntegration />
        </main>
    );
};

export default HomePage;