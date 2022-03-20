import React from 'react'

function Table({headings, children}) {

  return (
    <table>
        <thead>
            <tr>
                {
                    headings.map(h => (<th key={h}>{h}</th>))
                }
            </tr>
        </thead>
        <tbody>
            {children}
        </tbody>
    </table>
  )
}

export default Table