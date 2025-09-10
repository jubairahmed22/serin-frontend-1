import ChunkData from "./components/HomePage/ChunkData";
import '../styles/globals.css'
import HomeSlider from './components/Website/HomePage/HomeSlider.jsx'
import BannerSlider from './components/Website/HomePage/BannerSlider.jsx'
import PopularBooks from './components/Website/HomePage/PopularBook'
import DailyDeals from './components/Website/HomePage/DailyDeals'
import TrendingNow from './components/Website/HomePage/TrendingNow'
import NewRelease from './components/Website/HomePage/NewRelease'
import FeaturedAuthors from './components/Website/HomePage/FeaturedAuthors'
import FeaturedPublishers from './components/Website/HomePage/FeaturedPublishers'
import ShopByCategory from './components/Website/HomePage/ShopByCategory'
import HomeCategorySection from './components/Website/HomePage/HomeCategorySection'
import DiscountedBooks from './components/Website/HomePage/DiscountedBooks'
import BannerSliderThree from './components/Website/HomePage/BannerSliderThree'
import HomeBannerGridTwo from './components/Website/HomePage/HomeBannerGridTwo'
import HomeBannerGridThree from './components/Website/HomePage/HomeBannerGridThree'
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="">
         <HomeSlider></HomeSlider>
         <HomeBannerGridTwo></HomeBannerGridTwo>
         <HomeBannerGridThree></HomeBannerGridThree>
         <HomeCategorySection></HomeCategorySection>
         {/* <PopularBooks></PopularBooks>
         <DiscountedBooks></DiscountedBooks>
         <ShopByCategory></ShopByCategory>
         <BannerSlider></BannerSlider>
         <DailyDeals></DailyDeals>
         <TrendingNow></TrendingNow>
         <NewRelease></NewRelease>
         
         <BannerSliderThree></BannerSliderThree>
         <FeaturedAuthors></FeaturedAuthors>
         <FeaturedPublishers></FeaturedPublishers> */}
         <Footer></Footer>
    </div>
  )
}

  