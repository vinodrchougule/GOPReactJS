import Spinner from 'react-bootstrap/Spinner';

function SpinnerLoader() {
  return (
    <Spinner animation="border" role="status">
      <span className="visually-hidden"></span>
    </Spinner>
  );
}

export default SpinnerLoader;