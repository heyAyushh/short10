import { Card, Container, Spacer, useToasts } from '@zeit-ui/react';
import styled from 'styled-components';
import * as React from 'react';
import { useState, useEffect } from 'react';
import {
	TextField,
	Stack,
	Button,
	CompoundButton,
	Label,
	Spinner,
	SpinnerSize,
	conButton,
	IIconProps,
	initializeIcons,
	TooltipHost,
	IconButton,
	ITooltipHostStyles,
	PrimaryButton
} from 'office-ui-fabric-react';
import useWindowSize from 'react-use/lib/useWindowSize';
import Confetti from 'react-confetti';
import { Inputs } from './inputs.tsx';
import useClippy from 'use-clippy';
import axios from 'axios';
import jwt from 'jsonwebtoken';

const tokens = {
	sectionStack: {
		childrenGap: 10
	},
	spinnerStack: {
		childrenGap: 20
	}
};

const addIcon = { iconName: 'AddLink' };
const AddLink = { iconName: 'AddLink', style: { fontSize: 60, color: '#323130' } };
const Copy = { iconName: 'Copy', style: { fontSize: 60, color: '#323130' } };
const qrCode = { iconName: 'QRCode', style: { fontSize: 60, color: '#323130' } };

const Box = styled.div`
	margin-left: 5%;
	margin-right: 5%;
	margin-bottom: 3%;
`;

export default () => {
	const [ isProcessing, setisProcessing ] = useState(false);
	const [ isResult, setisResult ] = useState(false);
	const [ isStarting, setisStarting ] = useState(true);
	const loadingMessages = [
		'Preparing coffee first ☕',
		'Hold a Second, Spongebob calling me 📲',
		'Sending virtual Hugs 🤗'
	];
	const [ generatedNewUrl, setgeneratedNewUrl ] = useState('bymsp.com');
	const { width, height } = useWindowSize();
	const [ clipboard, setClipboard ] = useClippy();
	const [ givenName, setGivenName ] = useState();
	const [ , setToast ] = useToasts();
	const [ token, setToken ] = useState();

	const toast = (text, type) =>
		setToast({
			text,
			type
		});

	useEffect(() => {
		//setValue1(clipboard);

		axios
			.get(process.env.REACT_APP_WEBSITE + '/.auth/me')
			.then((res) => {
				setToken(res.data[0]['id_token']);
				var decoded = jwt.decode(token);
				setGivenName(decoded.given_name);
			})
			.catch((err) => {
				console.log(err);
				toast('Error in Auth token, Check later.');
			});

		axios
			.get(process.env.REACT_APP_BACKEND_URL + '/api/ping?code=' + process.env.REACT_APP_FUNCTION_KEY)
			.then((res) => {
				console.log('Ping Successful');
			})
			.catch((err) => {
				console.log(err);
				toast('Error, Check later.');
			});
	});

	function _nextStep() {
		if (isStarting) {
			setisProcessing(true);
			setisStarting(false);
		} else if (isProcessing) {
			setisProcessing(false);
			setisResult(true);
		} else if (isResult && generatedNewUrl) {
			setisResult(false);
			setisStarting(true);
		}
	}

	function getData(state) {
		// do not forget to bind getData in constructor
		_nextStep();

		axios
			.post(
				process.env.REACT_APP_BACKEND_URL + '/api/links?code=' + process.env.REACT_APP_FUNCTION_KEY,
				{
					url: state.value1,
					shortenedUrl: state.value2
				},
				{ headers: { 'x-ms-token-aad-id-token': token } }
			)
			.then((res) => {
				setisResult(true);
				setisProcessing(false);
				toast('URL Generated', 'success');
				setgeneratedNewUrl(res.data.shortenedUrl);
			})
			.catch((err) => {
				setisResult(false);
				setisStarting(true);
			});
	}

	const Content = () => {
		if (isStarting) {
			return (
				<Stack tokens={{ childrenGap: 60, padding: '5%' }}>
					<Inputs sendData={getData} />
				</Stack>
			);
		} else if (isProcessing) {
			return (
				<div>
					<Spacer y={10} />

					<Spacer y={10} />
					<Stack tokens={tokens.sectionStack} horizontalAlign="center">
						<Stack tokens={tokens.spinnerStack}>
							<Spinner
								label={loadingMessages[Math.floor(Math.random() * loadingMessages.length)]}
								size={SpinnerSize.large}
							/>
						</Stack>
					</Stack>
					<Spacer y={10} />
				</div>
			);
		} else if (isResult) {
			if (navigator.vibrate) {
				window.navigator.vibrate(200);
			}
			return (
				<div>
					<Stack tokens={{ childrenGap: 60, padding: '5%' }}>
						<TextField
							label="Your Short URL"
							key="customUrl"
							disabled={true}
							placeholder="Custom link?"
							prefix="https://bymsp.com/"
							value={generatedNewUrl}
							styles={{ fieldGroup: { width: '100%', textHeight: 70, height: 70 }, padding: 50 }}
						/>

						<Stack horizontal horizontalAlign="center">
							<TooltipHost content="Download QR Code">
								<IconButton
									iconProps={qrCode}
									styles={{ root: { height: 60, width: 60 } }}
									href={'https://qrfn.azurewebsites.net/api/qrfn?text="' + generatedNewUrl + '"'}
								/>
							</TooltipHost>
							<TooltipHost content="Copy to Clipboard">
								<IconButton
									styles={{ root: { height: 60, width: 60 } }}
									iconProps={Copy}
									onClick={() => {
										setClipboard(process.env.REACT_APP_BACKEND_URL +'/'+ generatedNewUrl);
									}}
								/>
							</TooltipHost>
							<TooltipHost content="Create New link">
								<IconButton
									styles={{ root: { height: 60, width: 60 } }}
									iconProps={AddLink}
									onClick={_nextStep}
									secondaryText=""
								/>
							</TooltipHost>
						</Stack>
						<Spacer y={10} />

						<Confetti width={width} height={height} />
					</Stack>
				</div>
			);
		}
	};

	return (
		<Box>
			<h1>Hello {givenName ? ', ' + givenName : ''} 👋</h1>

			<div>
				<Card shadow>
					<Spacer y={5} />
					<Content />
				</Card>
			</div>
		</Box>
	);
};
