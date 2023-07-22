import { MDBBtn, MDBBtnGroup} from 'mdb-react-ui-kit';

export const Toolbar = () => {
    return (
        <MDBBtnGroup toolbar role='toolbar' aria-label='Toolbar with button groups' className='tool-container' >
                <MDBBtnGroup size='sm' className='me-2 toolbar' aria-label='First Group'>
                    <MDBBtn>All</MDBBtn>
                    <MDBBtn>A-Z</MDBBtn>
                    <MDBBtn>Z-A</MDBBtn>
                    <MDBBtn>MOST RECENT</MDBBtn>
                    <MDBBtn>LEAST RECENT</MDBBtn>
                </MDBBtnGroup>
            </MDBBtnGroup>
    )
}