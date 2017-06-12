import React, {PureComponent} from 'react';
import AppBar from 'material-ui/AppBar';


class Frame extends PureComponent {
    constructor(props) {
        super(props);

    }
    onShowMenu = () => {
        console.log('ok');
    }
    render() {
        const {title} = this.props;
        return (
            <div>
                <AppBar
                    title={title}
                    onLeftIconButtonTouchTap={this.onShowMenu}
                />
                <div className="menu">
                </div>
            </div>
        );
    }
}

export default Frame;