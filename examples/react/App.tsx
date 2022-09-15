import { FunctionComponent } from 'react';

const App: FunctionComponent<{ children: JSX.Element }> = ({ children }) => {
	return (
		<div>
			<nav>Navigation</nav>
			{children}
		</div>
	);
};

export default App;
