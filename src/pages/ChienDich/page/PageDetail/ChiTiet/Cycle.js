import classNames from "classnames/bind";
import style from "./Cycle.module.scss";
import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios"; 
import AppProjectCycle from "./AppProjectCycle";

const cx = classNames.bind(style);

const Cycle = () => {
    const dataset = [
      {
        title: 'Strategy, origination and structuring',
        color: '#CD7C7F',
        stages: [
          { color: '#F5E3E1', title: 'Country and entity work programmes', desc: "Country and entity work programmes are developed with alignment to each country's climate priorities and GCF's strategic plan.", actor: 'NDAs, AEs, GCF' },
          { color: '#EFD5D2', title: 'Targeted project generation', desc: "Supplements to country and entity work programmes are considered and scaled to further strengthen a country's climate action.", actor: 'NDAs, AEs, GCF' },
          { color: '#EAC7C4', title: 'Concept note submission', desc: 'Concept notes can help increase proposal efficiency.', actor: 'NDAs, AEs' }
        ]
      },
      {
        title: 'Technical review and appraisal',
        color: '#8B8BA9',
        stages: [
          { color: '#CDCEDE', title: 'Funding proposal development', desc: 'Funding proposals prepared by Accredited Entities must adhere to GCF requirements and policies.', actor: 'AEs' },
          { color: '#BFC1D4', title: 'Funding proposal review', desc: 'Reviews conducted by the GCF Secretariat and the Independent Technical Advisory Panel ensure the quality and completeness of FPs and act as a second-level due diligence.', actor: 'GCF Secretariat + iTAP' },
        ]
      },
      {
        title: 'Approval and legal arrangements',
        color: '#5E919F',
        stages: [
          { color: '#ACC9D1', title: 'Board approval', desc: 'Board meetings provide an avenue for discussion and collaboration in our global climate action.', actor: 'Board' },
          { color: '#9BBEC7', title: 'Legal arrangements', desc: 'Settling legal arrangements of approved funding proposals are critical in carrying out climate projects in the long-term.', actor: 'AEs, GCF' },
        ]
      },
      {
        title: 'Implementation',
        color: '#618E80',
        stages: [
          { color: '#9EBDB5', title: 'Monitoring for performance and compliance', desc: 'Proactive and regular monitoring of projects and AE guarantees risks are mitigated, and equitable and sustainable climate actions are scaled up.', actor: 'AEs, GCF' },
          { color: '#8EB2A9', title: 'Adaptive management', desc: 'GCF recognises that projects and programmes are dynamic. The adaptive management approach is in place to respond to changes and adjust accordingly.', actor: 'AEs, GCF' },
          { color: '#7EA79D', title: 'Evaluation, learning and project closure', desc: 'Outlining lessons learned lead to better design and implementation of next-gen GCF investment decisions and projects/programmes.', actor: 'AEs, GCF' },
        ]
      }
    ];
  
    return (
      <div className="project-cycle project-cycle--cycle-mode project-cycle--intro">
        <h1 className="project-cycle__page-title mt-md-5 h5 text-uppercase">
          GCF Project Activity Cycle
        </h1>
        <div
          className="project-cycle__bg"
          style={{ backgroundImage: 'url(/sites/default/files/page/bg-blur.jpg)' }}
        ></div>
        <div className="project-cycle__container will-change-transform d-flex justify-content-center align-items-center">
          <div className="vue-component position-relative w-100 h-100" id="project-cycle-vue">
            <AppProjectCycle numProjects={190} dataset={dataset} />
          </div>
        </div>
      </div>
    );
  };

export default Cycle;