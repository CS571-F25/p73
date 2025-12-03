import {Pagination} from "react-bootstrap";

// some of my jsx components (filters, restaurantsmodal, togglelike) are actually code that
// I've written inside Blog.jsx. But, after looking at the 12 component requirements I have decided to
// "abstract" some of my code into separate components, (just copy and paste it into a separate jsx file). 
// and that's why I'm not using props as the argument for each function, but instead asking for specific items to be
// passed in, because I wrote them with those names and I don't wanna replace them all with props.something.
// Hope this counts!
export default function CreatePagination({itemToSlice, maxPerPage, setPage, page}) {
    let totalPages = Math.ceil(itemToSlice.length / maxPerPage);
    if(totalPages === 0) {
        totalPages = 1;
    }
    let items = [];
    for(let i = 1; i <= totalPages; i++) {
        items.push(
            <Pagination.Item aria-label="Page" onClick={() => setPage(i)} key={i} active={page === i}>{i}</Pagination.Item>
        );
    }

    return (
        <div>
        {itemToSlice.length > maxPerPage ? 
            <Pagination className="mt-4">
                <Pagination.Item aria-label="Previous Page" onClick={() => {
                    if(page > 1) {
                        setPage(page - 1);
                    }
                }} disabled={page === 1 || totalPages === 1}>Previous</Pagination.Item>
                {items}
                <Pagination.Item aria-label="Next Page" onClick={() => {
                    if(page < totalPages) {
                        setPage(page+1);
                    }
                }} disabled={page === totalPages || totalPages === 1}>Next</Pagination.Item>
            </Pagination>
            : null
        }
        </div>
    )
}