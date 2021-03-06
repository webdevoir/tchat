# tChat

tChat is a dating app that allows users from nontraditional gender identities
to feel free to be themselves and explore relationships with others in a fun
and healthy setting. The core functionality for this (auth, profiles/profile editing,
browsing users in your area, and messaging) were built over the span of 10 days and
were heavily inspired by design from okCupid.

Live link to the app can be found here --> [tChat](http://www.tchat.lgbt)

## How to get started

If you are looking to participate as a member of the community you would

1. go to the live link and press on the join today button or just hit Demo and skip to step three if you're just here for a quick peek.

![Welcome_screen](http://res.cloudinary.com/dyv6nxcqz/image/upload/v1523652971/Screen_Shot_2018-04-13_at_1.55.46_PM.png)

2. Fill out a very brief set of details for us to get your personal account set up. Upon success you will be taken to the user view page.

![Signup_modal](http://res.cloudinary.com/dyv6nxcqz/image/upload/v1523653262/Screen_Shot_2018-04-13_at_2.00.37_PM.png)

3. If you want, take a brief detour to the edit profile page to update your account info.

![Edit_page](http://res.cloudinary.com/dyv6nxcqz/image/upload/v1523653397/Screen_Shot_2018-04-13_at_2.02.43_PM.png)

4. Now that you've got a pretty account all set up it's time to get chatting! Head over to the browse users page. Here you will get to scroll quickly through other users in your city.

![Browse_users](http://res.cloudinary.com/dyv6nxcqz/image/upload/v1523654383/Screen_Shot_2018-04-13_at_2.19.11_PM.png)

5. On the browse users page you can click on any user to see what they've got going on. All users will be in the city you have listed on your profile.

![Their_profile](http://res.cloudinary.com/dyv6nxcqz/image/upload/v1523653734/Screen_Shot_2018-04-13_at_2.08.28_PM.png)

6. Now that you're here you should see a message button on the right. Click that and a modal will pop up. Type out a fun first message.

![Message_poppup](http://res.cloudinary.com/dyv6nxcqz/image/upload/v1523653891/Screen_Shot_2018-04-13_at_2.11.00_PM.png)

7. You will now be taken to the messages page. Now you can just wait until somebody gets back. You're officially tChatting.
If you ever run out of conversation just hit Browse Users to find more people.

![Message_page](http://res.cloudinary.com/dyv6nxcqz/image/upload/v1523654062/Screen_Shot_2018-04-13_at_2.13.51_PM.png)

## What it does

tChat, while existing as a dating app is effectively a chat app with some extra bells and whistles. The main functionality is that users can talk with one another in a safe and secure environment. While the quizzes and the likes and the swipes and some of the matching functionality is really cool it isn't a huge necessity for a dating app that is focused on a smaller demographic and can provide users with an excuse for not actually starting a conversation. On tChat the only way for two individuals to interact is to chat. All other features now and moving forward are designed to make finding others to chat with easier.

The two other major features that exist because of this are profiles and the browse users view. The profile view is very simple. A single photo, a short bio, list of hobbies, etc. The only required items are pronouns, age, and city. City is mandatory for the browsing filtering functions and also to prevent users with a very meet up oriented mindset from chatting to somebody with whom that isn't possible. Age and pronouns are required as they are important things to know before potentially misgendering somebody or becoming unknowingly subjected to predatory behavior from older users. Browse Users is also extremely simple. A scroll page through all users in your area, shuffled every time you enter the page. The only way to positively interact with users seen here is to send them a message (in the future you will also be able to block).

## How it was built

#### Technology

tChat is a full-stack web app built using Ruby On Rails and Postgres on the back end and a react/redux front end. The site is current hosted on Heroku. Additionally Cloudinary was used for photo storage and user uploads.

#### The Code

There are three parts of my code that I would like to share not necessarily for their complexity but for their importance in the functioning of this project.

1. The selectors I wrote were extremely important in the implementation of my browse users and messagethread indexing features. The select users function finds all of the other users that are in the same city as the current user but are not the current user and shuffles them using a fisher-yates shuffle function. The selectMessagethreads function on the other hand orders all relevant messagethreads from state (those that the current user is a part of) and orders them by the date of the last message sent. Two fairly simple functions that handle most of the logic for their respective features.

```Javascript
function shuffle (array) {
  let i = 0;
  let j = 0
  let temp = null

  for (i = array.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1))
    temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
}

export const selectUsers = state => {
  let result = [];
  for (let id in state.users){
    if (state.users[id].id !== state.session.currentUser.id){
      if (state.users[id].city === state.session.currentUser.city){
        result.push(state.users[id]);
      }
    }
  }
  shuffle(result);
  return result;
};

export const selectMessagethreads = state => {
  let result = [];
  for (let id in state.messagethreads){
    if (state.messagethreads[id].initiator_id === state.session.currentUser.id || state.messagethreads[id].receiver_id === state.session.currentUser.id){
      // debugger;
      result.push(state.messagethreads[id]);
    }
  }
  if(result.length<=1){
    return result;
  }
  const sortedThreads = result.sort( (a, b) => {
    if (a["last_message_sent"] < b["last_message_sent"]) {
      return 1;
    } else if (a["last_message_sent"] > b["last_message_sent"]) {
      return -1;
    }
    return 0;
  });
  return sortedThreads;
};
```

2. Another snippet I want to highlight is the html behind my messaging view. Splitting the html up into two seperate subcontainers and keeping everything very separated made this an extremely simple component to style and has kept everything in their place very nicely.

```html
<header className="message-container">
  <div className="messagethread-index-container">
    {this.props.messagethreads.map(messagethread => <MessagethreadIndexItem currentUserId={this.props.currentUser.id} key={messagethread.id} messagethread={messagethread} />)}
  </div>
  <div className="messages-container">
    <div className="messages-topcontainer">
      <Link to={`/users/${this.props.currentMessagethread? (this.props.currentMessagethread.initiator_id===this.props.currentUser.id? this.props.currentMessagethread.receiver_id : this.props.currentMessagethread.initiator_id): ""}`}>
        <img src={this.props.currentMessagethread? ((this.props.currentMessagethread.initiator_id===this.props.currentUser.id? this.props.currentMessagethread.receiver_profpic : this.props.currentMessagethread.initiator_profpic) || 'http://res.cloudinary.com/dyv6nxcqz/image/upload/v1523398897/default.jpg') : 'http://res.cloudinary.com/dyv6nxcqz/image/upload/v1523605725/pink-left-arrow-png-image-229.png'}/>
      </Link>
      <div className="messages-toprightcontainer">
        <span className="messages-screenname">{this.props.currentMessagethread? (this.props.currentMessagethread.initiator_id===this.props.currentUser.id? this.props.currentMessagethread.receiver_name : this.props.currentMessagethread.initiator_name) : "Pick a friend to chat"}</span>
        <span>{this.props.currentMessagethread? (this.props.currentMessagethread.initiator_id===this.props.currentUser.id? this.props.currentMessagethread.receiver_pronouns : this.props.currentMessagethread.initiator_pronouns) : ""}</span>
      </div>
    </div>
    <div className="message-middlecontainer">
      {this.props.messages.map(message => <MessageIndexItem currentUserId={this.props.currentUser.id} message={message}/>)}
      <div id="scrollBottom"/>
    </div>
    <div className="message-bottomcontainer">
      <form onSubmit={this.handleSubmit}>
        <textarea
          value={this.state.message}
          rows="3"
          cols="33"
          onChange={this.update('message')}
          className="new-message"
          onKeyDown={this.checkForEnter}
        ></textarea>
      </form>
    </div>
  </div>
</header>
```

3. The last piece of code I'd like to briefly highlight is incorporating cloudinary into the application. Given how the rest of the code was written fitting in an API call to an outside service was very easy.

```Javascript
handleCloudinary(e) {
  e.preventDefault();
  cloudinary.openUploadWidget(window.cloudinary_options, (error, results) => {
    if(error)
      -1;
    else
      this.setState({ img_url: results[0].secure_url });
  });
}
```

## Design documents

+ [Proposed Schema](https://github.com/mattieholtzer/tchat/wiki/Schema)
+ [Proposed Routes](https://github.com/mattieholtzer/tchat/wiki/Routes)
+ [Proposed Sample State](https://github.com/mattieholtzer/tchat/wiki/Sample-State)
+ [Proposed Component Hierarchy](https://github.com/mattieholtzer/tchat/wiki/Component-Hierarchy)

## Where it will go from here

There are many next steps for this app to go through. Here are a few.

#### Core Features

1. Allow users to block other users.
2. Users will have an internal score and ranking based around some basic data (ratio of messages sent to received, block rate compared to others, )
3. Users will have an add user feature if their score is good enough that allows them to add new users through a temporary one sign up code they can send to a friend. Sign up will now mandates one of these codes to get on. On the other hand users with very low scores will be prevented from adding new members or potentially will be kicked off.


#### General

1. Refactoring of the html and css. Come up with a new color scheme and layout that isn't modeled so closely off of another site.
2. Enhance the messaging experience by adding notifications, having timestamps within the messagethread show page, being more clear about read and unread message threads, etc.
3. Set up messaging to use WebSockets so that the experience is much more real time.
4. Implement more robust error handling and notification throughout the applicaiton.
5. General speed improvements throughout the project.
