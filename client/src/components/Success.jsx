const Successful = ({ text }) => {
  return (
    <article id="success_message" role="status" aria-live="polite">
      <div className="my_message">
        <h6>{text || "Success"}</h6>
      </div>
      <div className="progress-container">
        <div className="progress-bar"></div>
      </div>
    </article>
  );
};

export default Successful;
