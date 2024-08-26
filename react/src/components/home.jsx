import TodaysDevotion from "./TodaysDevotion/TodaysDevotion";
import General from "./general/General";
import About from "./about/about";

const Home = () => {

  return (
    <div>
      <TodaysDevotion />
      <General/>
      <About/>
    </div>
  );
};

export default Home;