import { css } from 'styled-components';
import styled from 'styled-components';
import Msplogo from './logo/msplogo';
import { DefaultPalette, Stack, IStackStyles, IStackTokens, Link } from 'office-ui-fabric-react';
import * as React from 'react';
import { ActionButton, IIconProps } from 'office-ui-fabric-react';

const viewAll = { iconName: 'ViewAll' };
const report = { iconName: 'ReportHacked' };
const feedback = { iconName: 'Feedback' };
const logOut = { iconName: 'SignOut' };

// Non-mutating styles definition
const itemStyles = {
	alignItems: 'center',
	display: 'flex',
	height: 25,
	justifyContent: 'center'
};
const navStyles = {
	selectors: {
		':hover': {
			backgroundColor: 'blue'
		},
		'.parent &': {
			/* parent selector */
		},
		'& .child': {
			/* child selector */
		}
	},
	alignItems: 'center',
	display: 'flex',
	height: 102,
	justifyContent: 'center'
};

const stackTokens = { childrenGap: 60 };

export default (props) => {
	const Nav = styled.nav`
		overflow: auto;
		text-align: center;
		color: palevioletred;
	`;
	const Wrapper = styled.section`
		height: 102px;
		width: 100%;
		background: ${(props) => props.theme.header && css`color: palevioletred;`};
	`;
	const sectionStackTokens = { childrenGap: 10 };
	const wrapStackTokens = { childrenGap: 30 };

	return (
		<Stack tokens={sectionStackTokens}>
			<Stack horizontal wrap tokens={wrapStackTokens} horizontalAlign="space-evenly">
				<span style={itemStyles}>
					<Msplogo theme={props.theme} />
				</span>
				{/* 				<span style={itemStyles}>
					<Link href="/admin">Admin</Link>{' '}
				</span> */}
				<span style={itemStyles}>
					<Link href={process.env.REACT_APP_github}>Submit issues on GitHub</Link>
				</span>
				<span style={itemStyles}>
					<Link href={process.env.REACT_APP_twitter}>Follow me on Twitter</Link>
				</span>
			</Stack>
		</Stack>
	);
};
