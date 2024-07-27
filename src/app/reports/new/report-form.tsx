export function ReportForm() {
	return (
		<form>
			<label>
				Име и презиме
				<input type="text" />
			</label>
			<label>
				Категорија
				<select>
					<option>Почистување</option>
					<option>Поправка</option>
					<option>Пријава</option>
				</select>
			</label>
			<label>
				Опис
				<textarea />
			</label>
			<button>Пријави</button>
		</form>
	);
}