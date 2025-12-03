import {Container, Row, Col, Dropdown, DropdownButton, ButtonGroup, Button} from "react-bootstrap";

export default function CreateFilters({selectedPrice, selectedCuisine, selectedOther, setSelectedPrice, setSelectedCuisine, setSelectedOther, clearFilters, price, cuisine, misc}) {
    return (
    <Container fluid className="my-3">
        <Row className="g-3">
            <Col xs={12} md={4}>
                <DropdownButton aria-label="Price" as={ButtonGroup} title={"Price"} variant={"dark"} className="w-100">
                    {price.map(p => (
                        <Dropdown.Item key={p} active={selectedPrice === p} onClick={() => setSelectedPrice(p)}>{p}</Dropdown.Item>
                    ))}
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={() => setSelectedPrice("")}>Clear Price Filter</Dropdown.Item>
                </DropdownButton>
            </Col>
            <Col xs={12} md={4}>
                <DropdownButton aria-label="Cuisine" as={ButtonGroup} title={"Cuisine"} variant={"dark"} className="w-100">
                    {cuisine.map(p => (
                        <Dropdown.Item key={p} active={selectedCuisine === p} onClick={() => setSelectedCuisine(p)}>{p}</Dropdown.Item>
                    ))}
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={() => setSelectedCuisine("")}>Clear Cuisine Filter</Dropdown.Item>
                </DropdownButton>
            </Col>

            <Col xs={12} md={4}>
                <DropdownButton aria-label="Other" as={ButtonGroup} title={"Other"} variant={"dark"} className="w-100">
                    {misc.map(p => (
                        <Dropdown.Item key={p} active={selectedOther === p} onClick={() => setSelectedOther(p)}>{p}</Dropdown.Item>
                    ))}
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={() => setSelectedOther("")}>Clear Other Filter</Dropdown.Item>
                </DropdownButton>
            </Col>
        </Row>
        {
            // ok so clearly "w-x" controls width but like it doesn't go smaller than like 25 which is really annoying. If you do
            // "w-20" it just defaults to its normal size so what am i even supposed to do to make this smaller
        }
        <br></br>
        <Button className="w-20" variant="outline-danger" onClick={() => clearFilters()}>Clear Filters</Button>
    </Container>
    )
}