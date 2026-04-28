
export default function Button({ count, setCount }) {
  return (
    <button className="btn" onClick={() => setCount(count + 1)}>
      Сделать шаурму
    </button>
  );
}
