import React from 'react'

export default function NotificationCard(item) {
  return item.item.map((item) =>(
    <div className="card mb-2 border border-3 border-secondary rounded">
    <div className="card-body text-white-50 bg-dark">
      <h5 className="card-title text-white-50 fw-bold">{item.tutorName}</h5>
      <h6 className="card-subtitle mb-2 text-warning">{item.title}</h6>
      <div className="card-text">
          {item.siteTitle}
          </div>
      <div className="card-text">{item.ownerDisplayName}</div>
      <br />
      <a href={item.url} target="_blank" rel="noreferrer" className="btn btn-primary">
        Gözat
      </a>
    </div>
  </div>

  ))
}
