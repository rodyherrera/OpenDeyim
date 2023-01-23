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

import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { motion, useScroll } from 'framer-motion';
import { FiGithub } from 'react-icons/fi';
import { RiLockPasswordLine } from 'react-icons/ri';
import { IconButton } from '@mui/material';
import CustomCursor from 'custom-cursor-react';
import './Layout.css';

const Layout = () => {
    const { scrollYProgress } = useScroll();
    const Navigate = useNavigate();
    const Links = [
        // ! [TITLE, ICON, LINK, ISLOCAL]
        ['Source code', <FiGithub />, 'https://github.com/codewithrodi/OpenDeyim'],
        ['Terms and policy of use', <RiLockPasswordLine />, '/terms-and-policies-of-use', true]
    ];

    useEffect(() => {
        const SACursor = document.querySelector('#OpenDeyim-Root ._12c4J');
        const OnMouseMove = () => SACursor.style.zIndex = 100000;
        SACursor.style.zIndex = 0;
        document.addEventListener('mousemove', OnMouseMove);
        return () => {
            document.removeEventListener('mousemove', OnMouseMove);
        };
    }, []);

    return (
        <>
            <CustomCursor
                targets={['.Cursor-Hover-Effect']}
                dimensions={50}
                fill='#000000'
                strokeColor='#000000'
                smoothness={{
                    movement: 0.7,
                    scale: 0.1,
                    opacity: 0.8,
                }}
                targetOpacity={0.3}
            />

            <header>
                <motion.div id='Progress-Bar' style={{ scaleX: scrollYProgress }} />
                <h3 onClick={() => Navigate('/')}>OpenDeyim</h3>

                <ul>
                    {(Links.map(([ Title, Icon, Link, IsLocal = false ], Index) => (
                        <li
                            key={Index}
                            onClick={() => ((IsLocal) ? (Navigate) : (window.open))(Link, '_blank')}>
                            <IconButton size='small'>
                                {Icon}
                            </IconButton>
                            <span className='Desktop-Box'>{Title}</span>
                        </li>
                    )))}
                </ul>
            </header>

            <Outlet />
        </>
    );
};

export default Layout;