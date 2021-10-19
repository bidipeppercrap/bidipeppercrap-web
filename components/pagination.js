import Link from 'next/link'

export default function Pagination({ currentPage, url, pageCount }) {
    const nextPage = parseInt(currentPage) + 1
    const previousPage = parseInt(currentPage) - 1

    if (pageCount == 1) return null
    return (
        <div className="page__pagination">
            {currentPage > 1 &&
                <Link href={url + '/' + previousPage}>
                    <a className="pagination__link">👈</a>
                </Link>
            }
            {currentPage < pageCount &&
                <Link href={url + '/' + nextPage}>
                    <a className="pagination__link">👉</a>
                </Link>
            }
        </div>
    )
}