import { Component, OnInit } from '@angular/core';

interface Stage {
  title: string;
  text: string[];
  imgUrl: string;
}

@Component({
  selector: 'app-systems-thinking',
  templateUrl: './systems-thinking.component.html',
  styleUrls: ['./systems-thinking.component.scss'],
})
export class SystemsThinkingComponent implements OnInit {
  public stages: Stage[] = [];
  public component = SystemsThinkingComponent;

  public ngOnInit(): void {
    this.stages = [
      {
        title: 'Urban water flows',
        text: [
          'When people use water in their homes, increased consumer demand for water result in a higher household foul water inflow into the system.',
          'When it rains, the rainfall increases stormwater. Some of this water may seep through the soil and become part of ground water, while some may flow across surfaces and become part of the combined sewer water.',
          'The term "Excess Water" is currently conceptualised as that part of fallen precipitation which has not infiltrated into groundwater. In this version of WSIMOD, it is calculated as the sum of stormwater discharge to a subcatchment’s outlet and the surface runoff in the same subcatchment. Climate change can increase the amount of excess water as a result of increased rainfall.',
          'In the VDR, excess water is calculated as the sum of stormwater discharge to a sub-catchment’s outlet and the surface runoff in the same sub-catchment.',
          'Note: all figures are created with BioRender.com.',
        ],
        imgUrl: 'sys-thinking-1.jpg',
      },
      {
        title: 'Land permeability effects',
        text: [
          'In northern England, combined sewer of stormwater and household water is a common infrastructure. As the volume of stormwater that enters into the sewer system increases, so does the risk of combined water overflow when the capacity of the sewer system is exceeded.',
          'Permeable land allows water to seep through the soil directly to ground water, which can reduce excess water.',
          'In the VDR, the proportion of impervious land is a parameter that users can modify. It is derived by using land cover maps i.e. urban/paved areas that are impermeable to water. A higher proportion of impervious land means that the land is less permeable. As a result, a greater proportion of rainfall becomes surface runoff. Conversely, if the land is more permeable, the proportion of impervious land decreases.',
        ],
        imgUrl: 'sys-thinking-2.jpg',
      },
      {
        title: 'Risks of system failures',
        text: [
          'A few types of system failures to consider. The first is related to the capacity of the storm and foul system being exceeded. This can lead to local flooding and property damage as well as combined water overflow, which impacts water quality in open water systems (rivers, lakes or beaches).',
          'Another type of failure is related to water deficit, which occur when there is not enough water collected and treated within the system, resulting in a shortage of water. Water deficit can also reduce the availability of water for dilution, flushing, and effective treatment, leading to compromised water quality.',
        ],
        imgUrl: 'sys-thinking-3.jpg',
      },
      {
        title: 'Impact of climate change on urban water flows',
        text: [
          'Climate change is stressing water management systems, as it can lead to more intense rainfall and higher risks of surface water and combined water overflow.',
          'At the same time, climate change can increase the frequency and severity of droughts, which can decrease the water supply and lead to higher risks of water deficits.',
        ],
        imgUrl: 'sys-thinking-4.jpg',
      },
      {
        title: 'Impact of urban developments on urban water flows',
        text: [
          'Urban developments increase consumer demand for water, contributing to the increased probabilities of system failures.',
          'For example, new urban developments typically increase consumer demand for water, stressing the water management system. An increase in consumer demand means an increase in foul water inflow, posing challenges to the sewer capacity.',
          'In addition, new urban developments often involve the removal of permeable land, such as green spaces and wetlands, which can reduce the ability to absorb rainfall and pollutants, increase surface water and combined sewer water and eventually flooding risk, thus impacting the quality of the natural water systems.',
        ],
        imgUrl: 'sys-thinking-5.jpg',
      },
      {
        title: 'Impact of water neutrality design options',
        text: [
          'Water neutrality design options can reduce water consumption, improve water availability, mimic natural conditions and enhance biodiversity. For instance, water neutrality can be achieved thorough following ways to mitigate some of the negative impacts of urban developments on water management systems: the reduction in consumer demand for water, the increase in the amount of permeable land, the increase in collected and treated water',
          'In the VDR, attenuation volume is another parameter that users can modify. It refers to the system\'s capacity to store and slow down the stormwater runoff. Effective collection and treatment of water increases the system\'s capacity to control the water volume, decreasing excess water.',
        ],
        imgUrl: 'sys-thinking-6.jpg',
      },
      {
        title: 'Reactive mode of decision-making',
        text: [
          'Decision-making related to water management systems can be triggered by system failures or crises with funding and to mitigate system stress.',
          'By introducing water neutrality design options, there are three pathways of how governance decisions mitigate systems failures: mitigating flooding risks by changing consumer demand, mitigating flooding risk by changing permeability, mitigating risks of water deficit.',
          'The occurrence of system failures creates a connection between water flows, infrastructure, and governance sectors, forming a feedback process that can activate financial and managerial resources towards achieving water neutrality. However, they are activated only once system failures have occurred.',
        ],
        imgUrl: 'sys-thinking-7.jpg',
      },
      {
        title: 'Shifting decision-making modes using VDR',
        text: [
          'Rather, a proactive path towards water neutrality of urban developments requires integrated water management solutions across multiple sectors, including housing, water, and urban planning. This approach can lead to co-benefits for mitigating system failures, and requires collaborative decision-making among the key actors and actions that support water neutrality across the complexity of administrative and catchment boundaries.',
          'Digital tools such as a Virtual Decision Room (VDR) can provide a safe and efficient environment to explore water neutrality goals and targets, as well as various design options to mitigate the risks of system failures. By utilising VDR, stakeholders get instant feedback on their potential decisions and use these insights to proactively plan and design water management systems that are more resilient and sustainable over the long term.',
          'Effective integrated water management and governance are interdependent and can reinforce each other. By promoting collaborative decision-making and action across sectors, it is possible to move towards water neutrality and mitigate the risks of system failures.',
        ],
        imgUrl: 'sys-thinking-8.jpg',
      },
    ];
  }

  public static transformImgUrl(slug: string): string {
    return `../../../../assets/img/systems-thinking/${slug}`;
  }
}
