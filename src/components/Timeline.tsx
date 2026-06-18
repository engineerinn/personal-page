import React from "react";
import '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faCode, faCodeCompare, faTerminal,
  faCodePullRequest, faComputer, faCodeMerge} from '@fortawesome/free-solid-svg-icons';
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import '../assets/styles/Timeline.scss'

function Timeline() {
  return (
    <div id="professional-experience">
      <div className="items-container">
        <h1>Professional Experience</h1>
        {/* background colour
          grey : #4f4e4d
          magenta : #6B1558
        */}
        <VerticalTimeline>
          
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{ background: 'white', color: 'rgb(39, 40, 34)' }}
            contentArrowStyle={{ borderRight: '7px solid  white' }}
            date="Nov 2025 - present"
            iconStyle={{ background: '#6B1558', color: 'rgb(39, 40, 34)' }}
            icon={<FontAwesomeIcon icon={faCode} />}
          >
            <h3 className="vertical-timeline-element-title">Software Engineer and Technical Writer</h3>
            <h4 className="vertical-timeline-element-subtitle">Global</h4>
            <p>
              Full-stack Web Development, GenAI/LLM, Project Management, Business Development
            </p>
          </VerticalTimelineElement>

          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            date="Dec 2022 - Oct 2025"
            iconStyle={{ background: '#6B1558', color: 'rgb(39, 40, 34)' }}
            icon={<FontAwesomeIcon icon={faCodePullRequest} />}
          >
            <h3 className="vertical-timeline-element-title">Software Engineer</h3>
            <h4 className="vertical-timeline-element-subtitle">Seoul, Republic of Korea</h4>
            <p>
              Full-stack Development
              RAG/LLM, User Experience, ETL Development, Prototyping, Integration, Feasibility Studies
            </p>
          
          </VerticalTimelineElement>

          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            date="Mar 2019 - Aug 2021"
            iconStyle={{ background: '#6B1558', color: 'rgb(39, 40, 34)' }}
            icon={<FontAwesomeIcon icon={faComputer} />}
          >
            <h3 className="vertical-timeline-element-title">Research Assistant</h3>
            <h4 className="vertical-timeline-element-subtitle">Seoul, Republic of Korea</h4>
            <p>
            IoT Protocol and AI Studies, Research, Feasibility Studies, Frontend Development 
            </p>
          </VerticalTimelineElement>

          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            date="Jan 2018 - Feb 2019"
            iconStyle={{ background: '#6B1558', color: 'rgb(39, 40, 34)' }}
            icon={<FontAwesomeIcon icon={faCodeMerge} />}
          >
            <h3 className="vertical-timeline-element-title">Technical Consultant</h3>
            <h4 className="vertical-timeline-element-subtitle">Jakarta, Indonesia</h4>
            <p>
              Legacy ETL Service Enhancement, Optimization and Maintenance
            </p>
          </VerticalTimelineElement>

          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            date="Jun 2015 - Dec 2017"
            iconStyle={{ background: '#6B1558', color: 'rgb(39, 40, 34)' }}
            icon={<FontAwesomeIcon icon={faTerminal} />}
          >
            <h3 className="vertical-timeline-element-title">Software Engineer</h3>
            <h4 className="vertical-timeline-element-subtitle">Jakarta, Indonesia</h4>
            <p>
              Microservices Development, Team Leading, Full-stack Development, API Development, Data Engineering and Analysis
            </p>
          </VerticalTimelineElement>

        </VerticalTimeline>
      </div>
    </div>
  );
}

export default Timeline;