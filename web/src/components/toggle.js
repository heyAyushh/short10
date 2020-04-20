import React from 'react';
import { func, string } from 'prop-types';
import { IconButton } from 'office-ui-fabric-react';
// Import a couple of SVG files we'll use in the design: https://www.flaticon.com
import { DefaultPalette, Stack, IStackStyles, IStackTokens, Link as link } from 'office-ui-fabric-react';

import { DefaultButton, IIconProps } from 'office-ui-fabric-react';

const lightMode = { iconName: 'Sunny' };
const darkMode = { iconName: 'ClearNight' };


// Styles definition
const stackStyles = {
	/* 	root: {
		background: DefaultPalette.themeTertiary
	} */
};
const itemStyles = {
	fontSize: 58,
	selectors: {
		':hover': {
			backgroundColor: 'black',
			text: 'white'
		},
		'.parent &': {
			/* parent selector */
		},
		'& .child': { text: 'white' }
	},
	alignItems: 'center',
	/* 	background: DefaultPalette.themePrimary, */
	color: DefaultPalette.white,
	display: 'flex',
	height: 54,
	justifyContent: 'center'
};

const Toggle = ({ theme, toggleTheme }) => {
	const isLight = theme === 'light';
	
	return (
		<DefaultButton
		  toggle
		  text={isLight ? 'Dark Mode' : 'Light Mode'}
		  iconProps={isLight ? darkMode : lightMode}
		  onClick={toggleTheme}
		  allowDisabledFocus
		/>
	  );
};

Toggle.propTypes = {
	theme: string.isRequired,
	toggleTheme: func.isRequired
};

export default Toggle;
