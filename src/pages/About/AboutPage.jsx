import React from 'react';
import { Text } from '@chakra-ui/react';
import useMobileWidth from '../../common/useMobileWidth';
import FriendIcon from '../../assets/about-friend-icon.svg';
import GlobeIcon from '../../assets/about-globe-icon.svg';
import RocketIcon from '../../assets/about-rocket-icon.svg';
import WavesIcon from '../../assets/about-waves-icon.svg';
import Footer from '../../components/Footer/Footer';
import styles from './AboutPage.module.css';

const AboutPage = () => {
  const isMobile = useMobileWidth();
  return (
    <>
      <div className={styles['about-page']}>
        <div className={styles['welcome-section']}>
          <div>
            <Text className={styles['about-title-heading']} textStyle="header-1">
              WELCOME TO THE
              <br /> FIND YOUR ANCHOR LAUNCH MAP
            </Text>
            <br />
            <Text className={styles['about-text']}>
              We&apos;re so glad you&apos;re here!
              <br />
              If you are here, you know our little blue boxes exist!
            </Text>
          </div>
          <div className={styles['welcome-graphics-container']}>
            <div className={styles['welcome-graphics-row']}>
              <div className={styles['welcome-graphics-icon']}>
                <img src={FriendIcon} alt="" />
              </div>
              <div className={styles['welcome-graphics-icon']}>
                <img src={GlobeIcon} alt="" />
              </div>
              <div className={styles['welcome-graphics-icon']}>
                <img src={RocketIcon} alt="" />
              </div>
            </div>
            <div className={styles['welcome-graphics-row']}>
              <Text className={styles['welcome-graphics-text']}>
                Maybe you received a box from a friend.
              </Text>
              <Text className={styles['welcome-graphics-text']}>
                Or found a box out in the world.
              </Text>
              <Text className={styles['welcome-graphics-text']}>
                Or launched one for someone else to find.
              </Text>
            </div>
          </div>
          <div className={styles['welcome-graphics-container-mobile']}>
            <div className={styles['welcome-graphics-row']}>
              <div className={styles['welcome-graphics-icon']}>
                <img src={FriendIcon} alt="" />
              </div>
              <Text className={styles['welcome-graphics-text']}>
                Maybe you received a box from a friend.
              </Text>
            </div>
            <div className={styles['welcome-graphics-row']}>
              <div className={styles['welcome-graphics-icon']}>
                <img src={GlobeIcon} alt="" />
              </div>
              <Text className={styles['welcome-graphics-text']}>
                Or found a box out in the world.
              </Text>
            </div>
            <div className={styles['welcome-graphics-row']}>
              <div className={styles['welcome-graphics-icon']}>
                <img src={RocketIcon} alt="" />
              </div>
              <Text className={styles['welcome-graphics-text']}>
                Or launched one for someone else to find.
              </Text>
            </div>
          </div>
          <div>
            <Text>
              No matter how you found us, we&apos;re glad you did!
              <br />
              <br />
              <strong>
                This interactive map is a collection of all the FYA boxes in the world.
              </strong>
              <br />
              <br />
              We are strangers who care - worldwide.
              <br />A diverse community, made stronger by our common goal to stop suicide.
            </Text>
          </div>
        </div>
        <div className={styles['site-description-section']}>
          <Text className={styles['about-heading']} textStyle="header-2">
            How This Works
          </Text>
          <br />
          <Text className={styles['about-text']}>
            Each box we launch into the world is added to this map. But it doesn&apos;t end there.
            <br />
            <br />
            Find Your Anchor boxes are designed to be passed, or launched, from person to
            person.&nbsp;
            <br className={styles['newline-mobile']} />
            <br className={styles['newline-mobile']} />
            <strong>
              Launching (and relaunching) boxes helps us reach more people, spread more love, and
              grow this community.
            </strong>
            <br />
            <br />
            <strong>
              Help us grow this community of strangers who care by adding your box to the map.
            </strong>
          </Text>
        </div>
        <div className={styles['user-guide-section']}>
          <div className={styles['launch-box-section']}>
            <Text className={styles['about-heading']} textStyle="header-2">
              Launch a Box
            </Text>
            <br />
            <Text className={styles['about-text']}>
              Did you pass a box on to someone else? Did you place a box out in the world for
              someone to find?
              <br />
              <br />
              Every time we send a Find Your Anchor box into the world we call it:&nbsp;
              <strong>launching a box.</strong>
            </Text>
            <br />
            <Text className={styles['launch-box-about-text-center']}>
              <strong>
                This is when you organically (and intentionally) place a box in a new location for
                someone else to find, or give the box directly to someone else.
              </strong>
            </Text>
            <br />
            <Text>
              Find Your Anchor is all about community and connection and we encourage everyone to
              launch their box for someone new when they&apos;re ready. You can launch your box by
              personally giving it to someone you know in need, or you can launch the box
              anonymously.
              <br />
              <br />
              Our favorite launch spots are: libraries, parks, and coffeeshops; but really, the
              choice is yours!
              <br />
              <br />
              <strong>
                If you&apos;d like, you can let us know where you&nbsp;
                <a href="/launch-box-form" className={styles.hyperlink}>
                  launched
                </a>
                &nbsp;your box! All you need is a picture of the box number (located in the upper
                left of the box) and a zip code.
              </strong>
            </Text>
          </div>
          <div className={styles['found-box-section']}>
            {isMobile && <br />}
            <Text className={styles['about-heading']} textStyle="header-2">
              Found a Box
            </Text>
            <br />
            <Text className={styles['about-text']}>
              Did you find a box out in the world?
              <br />
              Did you receive a box from someone?
              <br />
              <br />
            </Text>
            <Text className={styles['about-text-center']}>
              <strong>First of all, welcome to the Find Your Anchor (FYA) community!</strong>
              <br />
              <br />
              This box was meant to find its way to you and we hope you can feel all the love packed
              in there.
              <br />
              <br />
              There are people all over the world who care.
              <br />
              <br />
            </Text>
            <Text>
              <strong>
                If you&apos;d like, you can&nbsp;
                <a href="/found-box-form" className={styles.hyperlink}>
                  claim
                </a>
                &nbsp;this box on the map! All you need is a picture of the box number (located in
                the upper left of the box) and a zip code.
              </strong>
            </Text>
            <img className={styles['waves-icon']} src={WavesIcon} alt="FYA Waves Icon" />
          </div>
        </div>
        <div className={styles['privacy-note-section']}>
          <Text className={styles['privacy-note-text']}>
            Once a box is launched, only the zip code is displayed (unless you share a photo!).
          </Text>
          <br />
          <Text className={styles['privacy-note-text']}>
            <em>
              &#10024;&#10024; -- Please know we will never display, share, or sell your personal
              information, so please do not include anything identifying yourself. Email will only
              be used for submission status updates.
            </em>
          </Text>
          <br />
          <Text className={styles['privacy-note-text']}>
            We&apos;re strangers who care - let&apos;s keep it that way! ;)
          </Text>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AboutPage;
