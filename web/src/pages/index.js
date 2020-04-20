import About from './about';
import Header from '../components/header';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import styled from 'styled-components';
import { useDarkMode } from '../components/useDarkMode';
import { lightTheme, darkTheme } from '../components/theme';
import { GlobalStyles } from '../components/global';
import Footer from '../components/footer';
import Toggle from '../components/toggle';
import Section1 from './homePage/Section1';
import { Stack } from 'office-ui-fabric-react';

const HeaderWrap = styled.div`background-color: ${({ theme }) => theme.header};`;
const FooterWrap = styled.div`background-color: ${({ theme }) => theme.footer};`;

export default function Home() {
	const [ theme, toggleTheme, componentMounted ] = useDarkMode();

	const themeMode = theme === 'light' ? lightTheme : darkTheme;

	if (!componentMounted) {
		return <div />;
	}

	return (
		<div className="container">
			<ThemeProvider theme={themeMode}>
				<GlobalStyles />

				<title>Short10</title>
				<link rel="icon" href="/favicon.ico" />

				<HeaderWrap>
					<Header className="header" theme={theme}/>
				</HeaderWrap>

				<Section1 />

				<FooterWrap>
					<Footer className="footer" theme={theme} />
				</FooterWrap>
			</ThemeProvider>
			<Stack horizontalAlign="end">
				<Toggle theme={theme} toggleTheme={toggleTheme} />
			</Stack>
		</div>
	);
}
