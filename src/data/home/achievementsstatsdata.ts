import tag from "@/assets/icons/achievements-stats/medal.webp";
import medal from "@/assets/icons/achievements-stats/medal-ribbon.webp";
import internationalPlacement from "@/assets/icons/achievements-stats/airplane-travel-around-the-world.webp";
import gradhat from "@/assets/icons/achievements-stats/graduate.webp";
import studentGroup from "@/assets/icons/achievements-stats/group.webp";

export const statsData = {
  items: [
    {
      label: " Placements So Far",
      icons: tag,
      startValue: 4743,
      endValue: 4754,
      suffix: "+",
    },
    {
      label: "National Placements",
      icons: gradhat,
      startValue: 0,
      endValue: 60,
      suffix: "+",
    },
    {
      label: "International Placements",
      icons: internationalPlacement,
      startValue: 0,
      endValue: 5,
      suffix: "+",
    },
    {
      label: "University Gold Medals",
      icons: medal,
      startValue: 0,
      endValue: 66,
      suffix: "+",
    },
    {
      label: "Years of Excellence",
      icons: studentGroup,
      startValue: 0,
      endValue: 20,
      suffix: "+",
    },
  ],
};

export default statsData;