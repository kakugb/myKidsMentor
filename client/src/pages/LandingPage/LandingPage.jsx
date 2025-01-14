import React from 'react'
import Header from './Header'
import Footer from './Footer'
import LearningSteps from './LearningSteps'
import CommunitySize from './CommunitySize'
import Recomendation from './Recomendation'
import FrequentQuestions from './FrequentQuestions'

function LandingPage() {
  return (
    <>
 <Header/>
 <LearningSteps/>
 {/* <CommunitySize/> */}
 {/* <Recomendation/> */}
 <FrequentQuestions/>
        <Footer/>
    </>
  )
}

export default LandingPage