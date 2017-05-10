import React from 'react';
import ReactDom from 'react-dom';

class MyTest extends React.Component {
    constructor(...args) {
        super(...args)
    }

    render() {
        return (
            <div>
                Hello world!
            </div>
        )
    }
}

ReactDom.render(
    <MyTest />,
    document.getElementById('example')
);