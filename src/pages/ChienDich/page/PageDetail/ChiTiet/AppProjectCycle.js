function AppProjectCycle({ numProjects, dataset }) {
    return (
        <div>
          <h2>Total Projects: {numProjects}</h2>
          {dataset.map((item, index) => (
            <div key={index} style={{ border: `2px solid ${item.color}`, margin: '10px', padding: '10px' }}>
              <h3>{item.title}</h3>
              {item.stages.map((stage, stageIndex) => (
                <div key={stageIndex} style={{ backgroundColor: stage.color, margin: '5px', padding: '5px' }}>
                  <h4>{stage.title}</h4>
                  <p>{stage.desc}</p>
                  <small>Actor: {stage.actor}</small>
                </div>
              ))}
            </div>
          ))}
        </div>
      );
}

export default AppProjectCycle;