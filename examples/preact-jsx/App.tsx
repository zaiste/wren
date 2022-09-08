import { FunctionComponent } from 'preact';

const App: FunctionComponent = ({ children }) => {
	return (
		<div>
			<nav>Navigation</nav>
			{children}
		</div>
	);
};

export default App;
