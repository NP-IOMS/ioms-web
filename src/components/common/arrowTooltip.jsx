import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

function arrowGenerator(color) {
    return {
        '&[x-placement*="bottom"] $arrow': {
            top: 0,
            left: 0,
            fontSize: 13.5,
            marginTop: '-0.95em',
            width: '2em',
            height: '1em',
            '&::before': {
                borderWidth: '0 1em 1em 1em',
                borderColor: `transparent transparent ${color} transparent`,
            },
        },
        '&[x-placement*="top"] $arrow': {
            bottom: 0,
            left: 0,
            fontSize: 13.5,
            marginBottom: '-0.95em',
            width: '2em',
            height: '1em',
            '&::before': {
                borderWidth: '1em 1em 0 1em',
                borderColor: `${color} transparent transparent transparent`,
            },
        },
        '&[x-placement*="right"] $arrow': {
            left: 0,
            fontSize: 13.5,
            marginLeft: '-0.95em',
            height: '2.05em',
            width: '1em',
            '&::before': {
                borderWidth: '1em 1em 1em 0',
                borderColor: `transparent ${color} transparent transparent`,
            },
        },
        '&[x-placement*="left"] $arrow': {
            right: 0,
            fontSize: 13.5,
            marginRight: '-0.95em',
            height: '2.05em',
            width: '1em',
            '&::before': {
                borderWidth: '1em 0 1em 1em',
                borderColor: `transparent transparent transparent ${color}`,
            },
        },
    };
}

const useStylesArrow = makeStyles(theme => ({
    tooltip: {
        position: 'relative',
    },
    arrow: {
        position: 'absolute',
        opacity: 0.9,
        '&::before': {
            content: '""',
            margin: 'auto',
            display: 'block',
            width: 0,
            height: 0,
            borderStyle: 'solid',
        },
    },
    popper: arrowGenerator(theme.palette.grey[700]),
}));

export default function ArrowTooltip(props) {
    const { arrow, ...classes } = useStylesArrow();
    const [arrowRef, setArrowRef] = React.useState(null);

    return (
            <Tooltip
                classes={classes}
                PopperProps={{
                    popperOptions: {
                        modifiers: {
                            arrow: {
                                enabled: Boolean(arrowRef),
                                element: arrowRef,
                            },
                        },
                    },
                }}
                {...props}
                title={
                    <React.Fragment>
                        <Typography variant="subtitle2">
                            <b>
                                {props.title}
                                <span className={arrow} ref={setArrowRef} />
                            </b>
                        </Typography>
                    </React.Fragment>
                }
            />
    );
}

