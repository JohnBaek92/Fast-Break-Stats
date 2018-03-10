require('Nokogiri')
require('open-uri')
require('csv')
require('byebug')

(2018..2018).to_a.each do |year|
  [{short: "ADV", long: "advanced"}, {short: "PG", long: "per_game"}].each do |type|
    doc = Nokogiri::HTML(open("https://www.basketball-reference.com/leagues/NBA_#{year}_#{type[:long]}.html"))
    rows = doc.search('table > tbody > tr.full_table')
    header = doc.search('table > thead > tr')[0]
    CSV.open("./data/csv/#{year}_#{type[:short]}.csv", 'wb') do |csv|
      csv << header.children.map { |x| x.children.text }.select { |x| x.length > 0 }
      rows.each do |row|
        new_row = row.children.map { |x| x.children.text }
        player_id = row.children[1].attribute('data-append-csv').text
        new_row[1] = new_row[1] + '\\' + player_id
        csv << new_row
      end
    end
  end
end