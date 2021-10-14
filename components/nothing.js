import Link from 'next/link'

export default function Nothing() {
    return (
        <div className="fullpage__container">
            <h1 className="loading__text">There is nothing here.</h1>
            <Link to="/"><a>Go back</a></Link>
        </div>
    )
}