import React, {Component} from 'react'
import {render} from 'react-dom'

function dateDiff(timestamp){
    var d = Math.abs(timestamp - new Date().getTime()) / 1000;
    var r = {};
    var s = {
        year: 31536000,
        month: 2592000,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1
    };

    Object.keys(s).forEach(function(key){
        r[key] = Math.floor(d / s[key]);
        d -= r[key] * s[key];
    });

    return r;
};

let gitHubRepos = 0;

export default class App extends Component {
    constructor(props) {
      super(props);
      this.state = { breathingSince: dateDiff('767318400000'), content: 0, maxContent: 4, visitedEasterEgg: false, };

      this.keyPress = this.keyPress.bind(this);

      axios.get('https://api.github.com/users/zgrav/repos?per_page=200')
      .then(function (response) {
        if (response.status !== 200) {
          throw new Error('Failed to get GH repos.');
        }

        gitHubRepos = response.data.length;
      })
      .catch(function (error) {
        throw new Error('Failed to get GH repos.' + error);
      });

    }

    keyPress(event) {
      const { content, maxContent, visitedEasterEgg } = this.state;

      if (event.keyCode === 37) {
        if (content === -1 && !visitedEasterEgg) {
          return;
        } else if (content === -1 && visitedEasterEgg) {
          this.setState({ content: 0 });
          return;
        }

        if (content === 0 && visitedEasterEgg)  {
          return;
        }

        this.setState({ content: content - 1 });
      }
      else if (event.keyCode === 39) {
        if (content === maxContent) {
          return;
        }

        if (content > maxContent) {
          this.setState({ content: maxContent });
          return;
        }

        this.setState({ content: content + 1 });
      }
    }

    componentDidMount() {
      this.interval = setInterval(() => this.setState({ breathingSince: dateDiff('767318400000') }), 1000);

      document.addEventListener('keydown', this.keyPress, false);
    }

    componentDidUpdate(prevProps, prevState) {
      if (prevState.content !== this.state.content) {
        if (this.state.content === -1) {
          this.setState({ visitedEasterEgg: true });
        }
      }
    }

    componentWillUnmount() {
      clearInterval(this.interval);

      document.removeEventListener()
    }

    render() {
        const { breathingSince, content, visitedEasterEgg } = this.state;
        if (content === -1) {
          return (
            <div className='trongrid'>
              <div className='welcome'>Welcome to the Grid! :)</div>
              <div className='tron'/>
            </div>
          )
        } else if (content === 0) {
          return (
            <div className='wrapper'>
              {visitedEasterEgg ? <p className='mainText' style={{ fontSize: 'xx-small' }}>EasterEgg found and disabled (╯°□°）╯︵ ┻━┻</p> : null}
              <p className='mainText' style={{ fontSize: 'xx-large' }}>OH SO MANY PRETTY COLORS!</p>
              <p className='mainText' style={{ fontSize: 'xx-large' }}>Curious about what this is?</p>
              <p className='mainText' style={{ fontSize: 'xx-large' }}>Hint: Use the left/right keys :)</p>
            </div>
          )
        } else if (content === 1) {
          return (
            <div>
              <p className='breathingSince'>I've been doing stupid stuff for {breathingSince.year} years, {breathingSince.month} months, {breathingSince.day} days, {breathingSince.hour} hours, {breathingSince.minute} minutes and {breathingSince.second} seconds.</p>
              <p className='breathingSince'>Yeesh! You think all this time it would be enough to realize my dumbfoundry, right? :D</p>
              <p className='breathingSince'>Who am I, you may ask? Well, keep on pressing that right key :)</p>
            </div>
          )
        } else if (content === 2) {
          return (
            <div>
              <div className='leftSideContainer'>
                <img className='meImg' src='./assets/img/me.jpg'/>
                <p className='meText' style={{ fontSize: 'smaller'}}>↑ I'm this lovable bastard right here! (⌐□_□)</p>
              </div>
              <div className='rightSideContainer'>
                <p className='meText'>Name: David Silva</p>
                <p className='meText'>Age: Go back a bit</p>
                <p className='meText'>Location: Mr.Worldwide</p>
                <p className='meText'>Interests: Lots, but mostly Counter-Strike and doing weird projects ¯\_(ツ)_/¯</p>
                <p className='meText'>Press right for contact info :)</p>
              </div>
            </div>
          )
        } else if (content === 3) {
          return (
            <div>
              <p className='contactText' style={{ fontSize: '125%' }}>I'm currently sitting at {gitHubRepos} repos in my GitHub, drop a look if interested ♥</p>
              <p className='contactText' style={{ fontSize: '125%' }}>You can learn more about me, who I am, what I do and where I've been over at my personal webpage (https://zgrav.pro) or you can throw me an email at me@zgrav.pro</p>
              <p className='contactText' style={{ fontSize: '125%', textAlign: 'center' }}>ヽ(´ー｀)ノ</p>
              <p className='contactText' style={{ fontSize: '125%', textAlign: 'right' }}>Press right for final thoughts, promise it's the last page.</p>
            </div>
          )
        } else if (content === 4) {
          return (
            <div>
              {!visitedEasterEgg ? <p className='finalThoughtsText' style={{ fontSize: '25%' }}>There's an easteregg to discover still btw :)</p> : null}
              <p className='finalThoughtsText'>I consider myself a tinkerer, I enjoy building/breaking/overthinking/overanalyzing stuff a bit too much, and when things fail to go as intended, I hammer it until it works :D</p>
              <p className='finalThoughtsText'>This CV is another example of such and also because I'm exploring the limits of the PocketCHIP.</p>
              <p className='finalThoughtsText'>The heartbeating LED is also controlled by this program in case you haven't noticed :)</p>
              <p className='finalThoughtsText'>Thanks for taking the time to go through this!</p>
            </div>
          )
        }
    }
}
