import useSWR from 'swr'
import { useState } from 'react'

import Link from 'next/link'
import Image from 'next/image'

import logo from '../public/logo_long.svg'

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Navbar({ isRightHanded }) {
    const { data: navlinks, error } = useSWR('/api/navlinks', fetcher)
    const primaryHandStyle = isRightHanded ? { flexDirection: 'row-reverse' } : { flexDirection: 'row' }
    const [toggleMenu, setToggleMenu] = useState(false)

    if (error) return <nav className="navbar borderize">X</nav>
    if (!navlinks) return <nav className="navbar borderize">...</nav>
    return (
        <>
        <div
        onClick={() => setToggleMenu(!toggleMenu)}
        style={primaryHandStyle}
        className="navbar__toggle borderize">☰</div>
        {toggleMenu &&
            <nav className="navbar">
                {toggleMenu &&
                    <ul className="navbar__menu">
                        <li className='navbar__menu__item'>
                            <Link onClick={() => setToggleMenu(false)} href='/'>
                                <a>
                                    <Image
                                        src={logo}
                                        alt='bidipeppercrap logo'
                                        height={21}
                                        width={165}
                                        priority={true}
                                    />
                                </a>
                            </Link>
                        </li>
                        {navlinks.map(link =>
                            <li key={link.path} className="navbar__menu__item">
                                <Link onClick={() => setToggleMenu(false)} href={link.path}>
                                    <a>{link.name}</a>
                                </Link>
                            </li>
                        )}
                    </ul>
                }
            </nav>
        }
        </>
    )
}
