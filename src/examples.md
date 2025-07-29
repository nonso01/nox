## marquee exaxple 1

```html
<div class="marquee">
  <div>
    <span>You spin me right round, baby. Like a record, baby.</span>
    <span>You spin me right round, baby. Like a record, baby.</span>
  </div>
</div>
```

```css
body {
  margin: 20px;
}

.marquee {
  height: 25px;
  width: 420px;

  overflow: hidden;
  position: relative;
}

.marquee div {
  display: block;
  width: 200%;
  height: 30px;

  position: absolute;
  overflow: hidden;

  animation: marquee 5s linear infinite;
}

.marquee span {
  float: left;
  width: 50%;
}

@keyframes marquee {
  0% {
    left: 0;
  }
  100% {
    left: -100%;
  }
}
```

## marquee example 2

```html
<div class="slider">
  <div class="slide-track bd">
    <div class="slide">
      <img
        src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/1.png"
        height="100"
        width="250"
        alt=""
      />
    </div>
    <div class="slide">
      <img
        src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/2.png"
        height="100"
        width="250"
        alt=""
      />
    </div>
    <div class="slide">
      <img
        src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/3.png"
        height="100"
        width="250"
        alt=""
      />
    </div>
    <div class="slide">
      <img
        src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/4.png"
        height="100"
        width="250"
        alt=""
      />
    </div>
    <div class="slide">
      <img
        src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/5.png"
        height="100"
        width="250"
        alt=""
      />
    </div>
    <div class="slide">
      <img
        src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/6.png"
        height="100"
        width="250"
        alt=""
      />
    </div>
    <div class="slide">
      <img
        src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/7.png"
        height="100"
        width="250"
        alt=""
      />
    </div>
    <div class="slide">
      <img
        src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/1.png"
        height="100"
        width="250"
        alt=""
      />
    </div>
    <div class="slide">
      <img
        src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/2.png"
        height="100"
        width="250"
        alt=""
      />
    </div>
    <div class="slide">
      <img
        src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/3.png"
        height="100"
        width="250"
        alt=""
      />
    </div>
    <div class="slide">
      <img
        src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/4.png"
        height="100"
        width="250"
        alt=""
      />
    </div>
    <div class="slide">
      <img
        src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/5.png"
        height="100"
        width="250"
        alt=""
      />
    </div>
    <div class="slide">
      <img
        src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/6.png"
        height="100"
        width="250"
        alt=""
      />
    </div>
    <div class="slide">
      <img
        src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/7.png"
        height="100"
        width="250"
        alt=""
      />
    </div>
  </div>
</div>
```

```css
body {
  align-items: center;
  background: #e3e3e3;
  display: flex;
  height: 100vh;
  justify-content: center;
}

.bd {
  border: 2px solid red;
}


@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(-250px * 7));
  }
}
.slider {
  background: white;
  box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.125);
  height: 100px;
  margin: auto;
  overflow: hidden;
  position: relative;
  width: 960px;
}
.slider::before,
.slider::after {
  background: linear-gradient(to right, white 0%, rgba(255, 255, 255, 0) 100%);
  content: "";
  height: 100px;
  position: absolute;
  width: 200px;
  z-index: 2;
}
.slider::after {
  right: 0;
  top: 0;
  transform: rotateZ(180deg);
}
.slider::before {
  left: 0;
  top: 0;
}
.slider .slide-track {
  -webkit-animation: scroll 40s linear infinite;
  animation: scroll 40s linear infinite;
  display: flex;
  width: calc(250px * 14);
}
.slider .slide {
  height: 100px;
  width: 250px;
}
```
