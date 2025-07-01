export default function Spinner() {
  return (
    <>
      <div className="spinner"></div>
      <style jsx>{`
        .connecting {
          text-align: center;
          padding: 20px;
        }
        .spinner {
          border: 4px solid #222;
          border-left-color: #34db69;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}
