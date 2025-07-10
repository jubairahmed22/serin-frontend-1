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

export default function Home() {
  return (
    <div className="">
         <HomeSlider></HomeSlider>
         <PopularBooks></PopularBooks>
         <ShopByCategory></ShopByCategory>
         <BannerSlider></BannerSlider>
         <DailyDeals></DailyDeals>
         <TrendingNow></TrendingNow>
         <NewRelease></NewRelease>
         <FeaturedAuthors></FeaturedAuthors>
         <FeaturedPublishers></FeaturedPublishers>
    </div>
  )
}