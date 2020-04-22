import logoDark from './logoHW.svg';
import logoLight from './logoHB.svg';
import React from 'react';

export default (props) => {
	const LogoPath = props.theme === 'light' ? logoLight : logoDark;
	return <img src={LogoPath.toString()} />;
};
