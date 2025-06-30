export default function Text({ text }) {
  return (
    <div>
      <p>{text ?? "no value passed"}</p>
    </div>
  );
}
