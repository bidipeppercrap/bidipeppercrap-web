export default function Navbar({ isRightHanded }) {
    return (
        <nav className="navbar" style={isRightHanded ? 'right: 0;' : 'left: 0;'}>
            
        </nav>
    )
}