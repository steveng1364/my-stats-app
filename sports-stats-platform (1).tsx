import React, { useState } from 'react';
import { BarChart3, TrendingUp, Download, Award, User, X, Check } from 'lucide-react';

const StatsApp = () => {
  const [activeTab, setActiveTab] = useState('batting');
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [activeTool, setActiveTool] = useState(null);
  const [compareSelection, setCompareSelection] = useState([]);

  const teamData = {
    name: "Long Island Storm Black 13U",
    record: "18-18-5",
    season: "Summer 2025",
    location: "West Hempstead, NY",
    staff: ["Coach Steve Goldstein", "Ergin Perovic", "Alex Benincasa", "Thomas Roulis"]
  };

  const battingStats = [
    { player: "Jack Foley", number: "77", gp: 41, pa: 125, ab: 87, avg: ".391", obp: ".576", ops: "1.266", slg: ".690", h: 34, b1: 18, b2: 10, b3: 2, hr: 4, rbi: 27 },
    { player: "Ayden Ortiz", number: "7", gp: 38, pa: 112, ab: 86, avg: ".279", obp: ".446", ops: ".819", slg: ".372", h: 24, b1: 19, b2: 3, b3: 1, hr: 1, rbi: 23 },
    { player: "Mike Piotrowski", number: "12", gp: 37, pa: 98, ab: 74, avg: ".270", obp: ".439", ops: ".750", slg: ".311", h: 20, b1: 18, b2: 1, b3: 1, hr: 0, rbi: 20 },
    { player: "Jacob Nieves", number: "43", gp: 38, pa: 109, ab: 78, avg: ".269", obp: ".458", ops: ".804", slg: ".346", h: 21, b1: 17, b2: 3, b3: 0, hr: 1, rbi: 18 },
    { player: "Lukas Hamilton", number: "42", gp: 34, pa: 104, ab: 74, avg: ".257", obp: ".471", ops: ".809", slg: ".338", h: 19, b1: 15, b2: 3, b3: 0, hr: 1, rbi: 15 },
    { player: "Liam Marcus", number: "3", gp: 39, pa: 95, ab: 69, avg: ".246", obp: ".453", ops: ".742", slg: ".290", h: 17, b1: 14, b2: 3, b3: 0, hr: 0, rbi: 10 }
  ];

  const pitchingStats = [
    { player: "Jack Foley", number: "77", gp: 12, ip: "24.1", era: "2.95", w: 4, l: 2, sv: 1, so: 28, bb: 8, h: 18 },
    { player: "Mike Piotrowski", number: "12", gp: 15, ip: "31.2", era: "3.12", w: 5, l: 3, sv: 0, so: 35, bb: 12, h: 25 },
    { player: "Ayden Ortiz", number: "7", gp: 10, ip: "18.0", era: "3.50", w: 3, l: 2, sv: 2, so: 22, bb: 9, h: 15 }
  ];

  const fieldingStats = [
    { player: "Jack Foley", number: "77", pos: "INF", gp: 41, tc: 98, po: 45, a: 51, e: 2, fp: ".980" },
    { player: "Ayden Ortiz", number: "7", pos: "INF/OF", gp: 38, tc: 76, po: 38, a: 36, e: 2, fp: ".974" },
    { player: "Liam Marcus", number: "3", pos: "C", gp: 39, tc: 245, po: 220, a: 23, e: 2, fp: ".992" }
  ];

  const getLeader = (stat) => {
    const sorted = [...battingStats].sort((a, b) => {
      const aVal = parseFloat(a[stat].toString().replace('.', ''));
      const bVal = parseFloat(b[stat].toString().replace('.', ''));
      return bVal - aVal;
    });
    return sorted[0];
  };

  const leader = getLeader('avg');

  const exportToCSV = () => {
    let data = activeTab === 'batting' ? battingStats : 
                activeTab === 'pitching' ? pitchingStats : fieldingStats;
    
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(',')).join('\n');
    const csv = headers + '\n' + rows;
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${teamData.name}-${activeTab}-stats.csv`;
    a.click();
  };

  const toggleComparePlayer = (player) => {
    if (compareSelection.find(p => p.player === player.player)) {
      setCompareSelection(compareSelection.filter(p => p.player !== player.player));
    } else if (compareSelection.length < 4) {
      setCompareSelection([...compareSelection, player]);
    }
  };

  const ComparePlayersView = () => (
    <div className="fixed inset-0 bg-black/80 z-50 overflow-y-auto p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Compare Players (Select up to 4)</h2>
            <button onClick={() => { setActiveTool(null); setCompareSelection([]); }} className="text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {battingStats.map(player => (
              <button
                key={player.player}
                onClick={() => toggleComparePlayer(player)}
                className={`p-4 rounded-lg text-left transition-all ${
                  compareSelection.find(p => p.player === player.player)
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold">{player.player} #{player.number}</div>
                    <div className="text-sm opacity-80">AVG: {player.avg} | OPS: {player.ops}</div>
                  </div>
                  {compareSelection.find(p => p.player === player.player) && <Check size={20} />}
                </div>
              </button>
            ))}
          </div>

          {compareSelection.length >= 2 && (
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Comparison Results</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-2">Stat</th>
                      {compareSelection.map(player => (
                        <th key={player.player} className="text-left py-3 px-2">{player.player}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {['avg', 'obp', 'ops', 'slg', 'h', 'hr', 'rbi'].map(stat => (
                      <tr key={stat} className="border-b border-gray-700/50">
                        <td className="py-3 px-2 font-semibold uppercase">{stat}</td>
                        {compareSelection.map(player => (
                          <td key={player.player} className="py-3 px-2">{player[stat]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const VisualizeStatsView = () => {
    const maxAvg = Math.max(...battingStats.map(p => parseFloat(p.avg)));
    
    return (
      <div className="fixed inset-0 bg-black/80 z-50 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Batting Average Visualization</h2>
              <button onClick={() => setActiveTool(null)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {battingStats.map(player => {
                const avg = parseFloat(player.avg);
                const width = (avg / maxAvg) * 100;
                
                return (
                  <div key={player.player} className="bg-gray-900 rounded-lg p-4">
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">{player.player}</span>
                      <span className="text-teal-400 font-bold">{player.avg}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-6 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-teal-500 to-teal-300 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                        style={{ width: `${width}%` }}
                      >
                        <span className="text-xs font-bold text-white">{player.h} H</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">OPS Distribution</h3>
              <div className="grid grid-cols-6 gap-2 h-64 items-end">
                {battingStats.map(player => {
                  const ops = parseFloat(player.ops);
                  const maxOps = 1.5;
                  const height = (ops / maxOps) * 100;
                  
                  return (
                    <div key={player.player} className="flex flex-col items-center">
                      <div className="w-full bg-gradient-to-t from-orange-500 to-orange-300 rounded-t-lg transition-all hover:from-orange-400 hover:to-orange-200" 
                           style={{ height: `${height}%` }}>
                      </div>
                      <div className="text-xs mt-2 text-center">
                        <div className="font-bold">{player.player.split(' ')[1]}</div>
                        <div className="text-teal-400">{player.ops}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SeasonTrendsView = () => {
    const games = Array.from({ length: 10 }, (_, i) => i + 1);
    
    return (
      <div className="fixed inset-0 bg-black/80 z-50 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Season Trends - Team Performance</h2>
              <button onClick={() => setActiveTool(null)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-bold mb-4">Team Batting Average Over Last 10 Games</h3>
              <div className="relative h-64">
                <svg className="w-full h-full">
                  <polyline
                    points={games.map((g, i) => {
                      const x = (i / (games.length - 1)) * 100;
                      const y = 100 - ((.220 + Math.random() * .080) / .350 * 100);
                      return `${x}%,${y}%`;
                    }).join(' ')}
                    fill="none"
                    stroke="#14b8a6"
                    strokeWidth="3"
                  />
                  {games.map((g, i) => {
                    const x = (i / (games.length - 1)) * 100;
                    const y = 100 - ((.220 + Math.random() * .080) / .350 * 100);
                    return (
                      <circle
                        key={g}
                        cx={`${x}%`}
                        cy={`${y}%`}
                        r="5"
                        fill="#14b8a6"
                      />
                    );
                  })}
                </svg>
                <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-400 mt-2">
                  {games.map(g => <span key={g}>G{g}</span>)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-900 rounded-lg p-6">
                <div className="text-gray-400 text-sm mb-2">Games Won</div>
                <div className="text-4xl font-bold text-green-400">18</div>
                <div className="text-sm text-gray-400 mt-1">43.9% Win Rate</div>
              </div>
              <div className="bg-gray-900 rounded-lg p-6">
                <div className="text-gray-400 text-sm mb-2">Games Lost</div>
                <div className="text-4xl font-bold text-red-400">18</div>
                <div className="text-sm text-gray-400 mt-1">43.9% Loss Rate</div>
              </div>
              <div className="bg-gray-900 rounded-lg p-6">
                <div className="text-gray-400 text-sm mb-2">Games Tied</div>
                <div className="text-4xl font-bold text-yellow-400">5</div>
                <div className="text-sm text-gray-400 mt-1">12.2% Tie Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const TeamRankingsView = () => {
    const rankings = [
      { category: 'Batting Average', leaders: battingStats.slice(0, 3).map(p => ({ ...p, stat: p.avg })) },
      { category: 'Home Runs', leaders: [...battingStats].sort((a, b) => b.hr - a.hr).slice(0, 3).map(p => ({ ...p, stat: p.hr })) },
      { category: 'RBIs', leaders: [...battingStats].sort((a, b) => b.rbi - a.rbi).slice(0, 3).map(p => ({ ...p, stat: p.rbi })) },
      { category: 'On Base Percentage', leaders: battingStats.slice(0, 3).map(p => ({ ...p, stat: p.obp })) }
    ];

    return (
      <div className="fixed inset-0 bg-black/80 z-50 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Team Rankings - Top Performers</h2>
              <button onClick={() => setActiveTool(null)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {rankings.map(ranking => (
                <div key={ranking.category} className="bg-gray-900 rounded-lg p-6">
                  <h3 className="text-lg font-bold mb-4 text-teal-400">{ranking.category}</h3>
                  <div className="space-y-3">
                    {ranking.leaders.map((leader, idx) => (
                      <div key={leader.player} className="flex items-center gap-4 p-3 bg-gray-800 rounded-lg">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          idx === 0 ? 'bg-yellow-500 text-black' :
                          idx === 1 ? 'bg-gray-400 text-black' :
                          'bg-orange-600 text-white'
                        }`}>
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold">{leader.player}</div>
                          <div className="text-xs text-gray-400">#{leader.number}</div>
                        </div>
                        <div className="text-xl font-bold text-teal-400">{leader.stat}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const StatTable = ({ data, columns }) => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-800 sticky top-0">
          <tr>
            {columns.map(col => (
              <th key={col.key} className="px-3 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider whitespace-nowrap">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {data.map((row, idx) => (
            <tr 
              key={idx} 
              className="hover:bg-gray-800 transition-colors cursor-pointer"
              onClick={() => setSelectedPlayer(row)}
            >
              {columns.map(col => (
                <td key={col.key} className="px-3 py-3 whitespace-nowrap text-gray-300">
                  {col.key === 'player' ? (
                    <div>
                      <div className="font-semibold text-white">{row.player}</div>
                      <div className="text-xs text-gray-500">#{row.number}</div>
                    </div>
                  ) : (
                    row[col.key]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const battingColumns = [
    { key: 'player', label: 'Player' },
    { key: 'gp', label: 'GP' },
    { key: 'pa', label: 'PA' },
    { key: 'ab', label: 'AB' },
    { key: 'avg', label: 'AVG' },
    { key: 'obp', label: 'OBP' },
    { key: 'ops', label: 'OPS' },
    { key: 'slg', label: 'SLG' },
    { key: 'h', label: 'H' },
    { key: 'b1', label: '1B' },
    { key: 'b2', label: '2B' },
    { key: 'b3', label: '3B' },
    { key: 'hr', label: 'HR' },
    { key: 'rbi', label: 'RBI' }
  ];

  const pitchingColumns = [
    { key: 'player', label: 'Player' },
    { key: 'gp', label: 'GP' },
    { key: 'ip', label: 'IP' },
    { key: 'era', label: 'ERA' },
    { key: 'w', label: 'W' },
    { key: 'l', label: 'L' },
    { key: 'sv', label: 'SV' },
    { key: 'so', label: 'SO' },
    { key: 'bb', label: 'BB' },
    { key: 'h', label: 'H' }
  ];

  const fieldingColumns = [
    { key: 'player', label: 'Player' },
    { key: 'pos', label: 'POS' },
    { key: 'gp', label: 'GP' },
    { key: 'tc', label: 'TC' },
    { key: 'po', label: 'PO' },
    { key: 'a', label: 'A' },
    { key: 'e', label: 'E' },
    { key: 'fp', label: 'FP' }
  ];

  if (selectedPlayer) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <header className="bg-teal-700 p-6 cursor-pointer hover:bg-teal-600 transition-colors" onClick={() => setSelectedPlayer(null)}>
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <div className="text-2xl">⚾</div>
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold">{teamData.name}</h1>
                <p className="text-sm text-teal-100">Click header to return to team stats</p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          <button 
            onClick={() => setSelectedPlayer(null)}
            className="mb-6 px-6 py-3 bg-teal-600 hover:bg-teal-500 rounded-lg transition-colors font-semibold text-lg flex items-center gap-2"
          >
            <span className="text-2xl">←</span> Back to Team Stats
          </button>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-20 h-20 bg-teal-600 rounded-full flex items-center justify-center text-3xl font-bold">
                  {selectedPlayer.number}
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{selectedPlayer.player}</h1>
                  <p className="text-gray-400">{teamData.name}</p>
                  <div className="flex gap-3 mt-2">
                    <span className="px-3 py-1 bg-gray-700 rounded-full text-sm">Position: Infield</span>
                    <span className="px-3 py-1 bg-gray-700 rounded-full text-sm">Bats: Right</span>
                    <span className="px-3 py-1 bg-gray-700 rounded-full text-sm">Throws: Right</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-800 rounded-xl p-6">
                <div className="text-gray-400 text-sm mb-2">Batting Average</div>
                <div className="text-5xl font-bold text-orange-400 mb-2">{selectedPlayer.avg}</div>
                <div className="text-sm text-teal-400">Team Leader</div>
                <div className="mt-4 text-gray-400 text-sm">On Base Percentage</div>
                <div className="text-3xl font-bold text-white mt-1">{selectedPlayer.obp}</div>
                <div className="text-sm text-teal-400">Team Leader</div>
              </div>

              <div className="bg-gray-800 rounded-xl p-6">
                <div className="text-gray-400 text-sm mb-2">OPS</div>
                <div className="text-5xl font-bold text-orange-400 mb-2">{selectedPlayer.ops}</div>
                <div className="text-sm text-teal-400">Team Leader</div>
                <div className="mt-4 text-gray-400 text-sm">Slugging</div>
                <div className="text-3xl font-bold text-white mt-1">{selectedPlayer.slg}</div>
                <div className="text-sm text-teal-400">Team Leader</div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Season Statistics (Summer 2025)</h2>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="text-gray-400 text-sm mb-1">Games Played</div>
                  <div className="text-3xl font-bold">{selectedPlayer.gp}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">Plate Appearances</div>
                  <div className="text-3xl font-bold">{selectedPlayer.pa}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">At Bats</div>
                  <div className="text-3xl font-bold">{selectedPlayer.ab}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">Hits</div>
                  <div className="text-3xl font-bold">{selectedPlayer.h}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">Home Runs</div>
                  <div className="text-3xl font-bold">{selectedPlayer.hr}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">RBIs</div>
                  <div className="text-3xl font-bold">{selectedPlayer.rbi}</div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setSelectedPlayer(null)}
              className="mt-6 w-full px-6 py-4 bg-teal-600 hover:bg-teal-500 rounded-lg transition-colors font-semibold text-lg flex items-center justify-center gap-2"
            >
              <span className="text-2xl">←</span> Back to Team Stats
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {activeTool === 'compare' && <ComparePlayersView />}
      {activeTool === 'visualize' && <VisualizeStatsView />}
      {activeTool === 'trends' && <SeasonTrendsView />}
      {activeTool === 'rankings' && <TeamRankingsView />}

      <header className="bg-teal-700 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <div className="text-2xl">⚾</div>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{teamData.name}</h1>
              <div className="flex gap-4 mt-2 text-sm">
                <span className="px-3 py-1 bg-white/20 rounded-full">{teamData.record}</span>
                <span className="px-3 py-1 bg-white/20 rounded-full">{teamData.season}</span>
                <span className="px-3 py-1 bg-white/20 rounded-full">{teamData.location}</span>
              </div>
              <div className="mt-2 text-sm text-teal-100">
                Staff: {teamData.staff.join(", ")}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('batting')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'batting' ? 'bg-teal-600' : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            Batting
          </button>
          <button
            onClick={() => setActiveTab('pitching')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'pitching' ? 'bg-teal-600' : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            Pitching
          </button>
          <button
            onClick={() => setActiveTab('fielding')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'fielding' ? 'bg-teal-600' : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            Fielding
          </button>
        </div>

        <div className="bg-gray-800 rounded-xl overflow-hidden mb-6">
          {activeTab === 'batting' && <StatTable data={battingStats} columns={battingColumns} />}
          {activeTab === 'pitching' && <StatTable data={pitchingStats} columns={pitchingColumns} />}
          {activeTab === 'fielding' && <StatTable data={fieldingStats} columns={fieldingColumns} />}
        </div>

        {activeTab === 'batting' && (
          <div className="bg-teal-900/30 border border-teal-700 rounded-lg p-4 mb-6 flex items-center gap-3">
            <div className="text-teal-400">ℹ️</div>
            <div className="text-teal-100">
              {leader.player} leads the team with a {leader.avg} batting average and {leader.ops} OPS
            </div>
          </div>
        )}

        <div className="mb-4 text-xl font-bold">Analysis Tools</div>
        <div className="grid grid-cols-3 gap-4">
          <button 
            onClick={() => setActiveTool('compare')}
            className="bg-white text-gray-900 p-4 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors font-semibold"
          >
            <BarChart3 size={20} />
            Compare Players
          </button>
          <button 
            onClick={() => setActiveTool('visualize')}
            className="bg-gray-800 text-white p-4 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-700 transition-colors font-semibold"
          >
            <TrendingUp size={20} />
            Visualize Stats
          </button>
          <button 
            onClick={() => setSelectedPlayer(battingStats[0])}
            className="bg-orange-500 text-white p-4 rounded-lg flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors font-semibold"
          >
            <User size={20} />
            Player Details
          </button>
          <button 
            onClick={exportToCSV}
            className="bg-gray-800 text-white p-4 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-700 transition-colors font-semibold"
          >
            <Download size={20} />
            Export Data
          </button>
          <button 
            onClick={() => setActiveTool('trends')}
            className="bg-gray-800 text-white p-4 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-700 transition-colors font-semibold"
          >
            <TrendingUp size={20} />
            Season Trends
          </button>
          <button 
            onClick={() => setActiveTool('rankings')}
            className="bg-gray-800 text-white p-4 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-700 transition-colors font-semibold"
          >
            <Award size={20} />
            Team Rankings
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatsApp;