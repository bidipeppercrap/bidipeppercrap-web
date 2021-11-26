import Image from 'next/image'

import logo from '../public/logo.svg'

export default function Footer() {
    return (
        <footer className="footer">
            <Image
                src={logo}
                alt="bidipeppercrap logo"
                width={50}
                height={50}
	            priority={true}
            />
        </footer>
    )
}
