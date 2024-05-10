import AddonsSlideshow from "../../components/AddonsSlideshow";
import AwardsBanner from "../../components/AwardsBanner";
import DiscoverAddonsText from "../../components/DiscoverAddonsText";
import WhatIsBlueprint from "../../components/WhatIsBlueprint";
import UsefulLinks from "../../components/UsefulLinks";
import BottomBar from "../../components/BottomBar";
import Contributors from "../../components/Contributors";

function Home() {
  return (
    <>
      <AwardsBanner />
      <DiscoverAddonsText />
      <AddonsSlideshow />
      <WhatIsBlueprint />
      <UsefulLinks />
      <Contributors />
      <br />
      <br />
      <BottomBar />
    </>
  );
}

export default Home;
