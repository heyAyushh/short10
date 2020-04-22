import { css } from 'styled-components';
import styled from 'styled-components';
import Logo from './logo/logo';
import { DefaultPalette, Stack, IStackStyles, IStackTokens } from 'office-ui-fabric-react';
import * as React from 'react';
import { ActionButton, IIconProps } from 'office-ui-fabric-react';
import FeedbackDialog from './feedbackDialog';
/* import {ReportPanel} from './reportPanel.tsx'; */
import { useMedia } from 'react-use';
import { MobileHeaderPanel } from './mobileHeaderPanel';

const report = { iconName: 'ReportHacked' };
const viewAll = { iconName: 'ViewAll' };
const logOut = { iconName: 'SignOut' };

const itemStyles = {
	alignItems: 'center',
	display: 'flex',
	height: 54,
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
	/* 	background: DefaultPalette.themePrimary, */
	color: DefaultPalette.white,
	display: 'flex',
	height: 54,
	justifyContent: 'center'
};

const stackTokens = { childrenGap: 60 };

export default (props) => {
	const isWide = useMedia('(min-width: 480px)');

	const Wrapper = styled.section`
		height: 54px;
		width: 100%;
		background: ${(props) => props.theme.header && css`color: palevioletred;`};
	`;

	// Header to be rendered on Laptop or desktop or tablets

	const BigHeader = (props) => {
		return (
			<Stack tokens={stackTokens}>
				<Stack horizontal horizontalAlign="space-around">
					<span style={itemStyles}>
						<Stack horizontal horizontalAlign="start">
							<Logo theme={props.theme} />
						</Stack>
					</span>
					<span style={navStyles}>
						<Stack horizontal horizontalAlign="center" tokens={stackTokens}>
							<span style={navStyles}>
								<ActionButton iconProps={viewAll} allowDisabledFocus>
									All Links
								</ActionButton>
							</span>
							<span style={navStyles}>
								<FeedbackDialog />
							</span>
							<span style={navStyles}>
								{/* <ReportPanel/> */}
								<ActionButton
									iconProps={report}
									allowDisabledFocus
									text="Report"
									href={process.env.REACT_APP_reportForm}
								/>
							</span>
						</Stack>
					</span>
					<span style={itemStyles}>
						<Stack horizontal horizontalAlign="end">
							<span style={itemStyles}>
								<ActionButton iconProps={logOut} allowDisabledFocus href={process.env.REACT_APP_SIGN_OUT_URL}>
									Sign Out
								</ActionButton>
							</span>
						</Stack>
					</span>
				</Stack>
			</Stack>
		);
	};

	// Header for Mobiles

	const SmolHeader = (props) => {
		return (
			<Stack tokens={stackTokens} horizontalAlign="start" verticalAlign="center">
				<MobileHeaderPanel theme={props.theme} />
			</Stack>
		);
	};

	return <Wrapper>{isWide ? <BigHeader theme={props.theme} /> : <SmolHeader theme={props.theme} />}</Wrapper>;
};
