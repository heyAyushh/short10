import mspDark from './mspfordark.svg';
import mspLight from './mspforlight.svg';
import React from 'react';

export default (props) => {
    const LogoPath = props.theme==="light" ? mspLight: mspDark;
    return <img src={LogoPath.toString()}/>
}