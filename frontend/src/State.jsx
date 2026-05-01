import { useState } from 'react';

export default function ScoreKeeper() {
	const [score, setScore] = useState(0);

	function handleClick() {
		setScore(score + 1);
		alert(`The score is: ${score}`);
	}

	return (
		<>
			<h1>Current Score: {score}</h1>
			<button onClick={handleClick}>
			</button>
		</>
	);
}
